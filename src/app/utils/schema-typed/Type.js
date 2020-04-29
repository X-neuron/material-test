function isEmpty(value) {
  return typeof value === 'undefined' || value === null || value === '';
}

function checkRequired(value, trim) {
  // String trim
  if (trim && typeof value === 'string') {
    value = value.replace(/(^\s*)|(\s*$)/g, '');
  }

  // Array
  if (Array.isArray(value)) {
    return !!value.length;
  }

  return !isEmpty(value);
}

function createValidator(data) {
  return (value, rules) => {
    for (let i = 0; i < rules.length; i += 1) {
      const { onValid, errorMessage } = rules[i];
      const checkResult = onValid(value, data);

      if (checkResult === false) {
        return { hasError: true, errorMessage };
      } if (typeof checkResult === 'object' && checkResult.hasError) {
        return checkResult;
      }
    }

    return null;
  };
}

function createValidatorAsync(data) {
  function check(errorMessage) {
    return checkResult => {
      if (checkResult === false) {
        return { hasError: true, errorMessage };
      } if (typeof checkResult === 'object' && checkResult.hasError) {
        return checkResult;
      }
      return null;
    };
  }

  return (value, rules) => {
    const promises = rules.map(rule => {
      const { onValid, errorMessage } = rule;
      return Promise.resolve(onValid(value, data)).then(check(errorMessage));
    });

    return Promise.all(promises).then(results => results.find(item => item && item.hasError));
  };
}

class Type {
  constructor(name) {
    this.name = name;
    this.required = false;
    this.requiredMessage = '';
    this.trim = false;
    this.rules = [];
    this.priorityRules = []; // Priority check rule
    this.validateOnBlur = false;
    this.validateOnChange = false;
  }

  check(value, data) {
    if (this.required && !checkRequired(value, this.trim)) {
      return { hasError: true, errorMessage: this.requiredMessage };
    }

    const validator = createValidator(data);
    const checkStatus = validator(value, this.priorityRules);

    if (checkStatus) {
      return checkStatus;
    }

    if (!this.required && isEmpty(value)) {
      return { hasError: false };
    }

    return validator(value, this.rules) || { hasError: false };
  }

  checkAsync(value, data) {
    if (this.required && !checkRequired(value, this.trim)) {
      return Promise.resolve({ hasError: true, errorMessage: this.requiredMessage });
    }

    const validator = createValidatorAsync(data);

    return new Promise(resolve => validator(value, this.priorityRules)
      .then(checkStatus => {
        if (checkStatus) {
          resolve(checkStatus);
        }
      })
      .then(() => {
        if (!this.required && isEmpty(value)) {
          resolve({ hasError: false });
        }
      })
      .then(() => validator(value, this.rules))
      .then(checkStatus => {
        if (checkStatus) {
          resolve(checkStatus);
        }
        resolve({ hasError: false });
      }));
  }

  pushRule(onValid, errorMessage, priority) {
    errorMessage = errorMessage || this.rules[0].errorMessage;

    if (priority) {
      this.priorityRules.push({ onValid, errorMessage });
    } else {
      this.rules.push({ onValid, errorMessage });
    }
  }

  addRule(onValid, errorMessage, priority) {
    this.pushRule(onValid, errorMessage, priority);
    return this;
  }

  isRequired(errorMessage, trim = true) {
    this.required = true;
    this.trim = trim;
    this.requiredMessage = errorMessage;
    return this;
  }

  checkOnChange(bool = true) {
    this.validateOnBlur = typeof bool === 'boolean'? bool: false;
    return this;
  }

  checkOnBlur(bool = true) {
    this.validateOnChange = typeof bool === 'boolean'? bool: false;
    return this;
  }
}

export default Type;
