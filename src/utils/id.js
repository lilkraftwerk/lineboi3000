export default () =>
    `_${Math.random()
        .toString(36)
        .substring(2)}${Date.now().toString(36)}_${Math.random()
        .toString(36)
        .substring(2)}${Date.now().toString(36)}`.substring(0, 20); // eslint-disable-line
