export function getContractType(data) {
  const types = [
    {
      name: 'V2 Vault',
      type: 'vault',
      fields: ['expectedReturn', 'emergencyShutdown'],
    },
    {
      name: 'V1 Vault',
      type: 'vault',
      fields: ['min', 'max', 'balance'],
    },
    {
      name: 'V2 Strategy',
      type: 'strategy',
      fields: ['apiVersion', 'strategist'],
    },
    {
      name: 'V1 Strategy',
      type: 'strategy',
      fields: ['strategist'],
    },
    {
      name: 'Token',
      type: 'token',
      fields: ['decimals', 'symbol', 'balanceOf'],
    },
  ];

  const keys = _.keys(data);
  const checkType = type => _.difference(type.fields, keys).length === 0;
  const contractType = _.find(types, checkType);

  return contractType ? contractType.name : 'Unknown';
}

export function getMethods(abi) {
  const findReadMethods = (acc, field) => {
    const { name, inputs, type, stateMutability } = field;
    const hasInputs = inputs && inputs.length;
    const isViewable = stateMutability === 'view' || stateMutability === 'pure';
    const isMethod = type === 'function';
    if (hasInputs || !isViewable || !isMethod) {
      return acc;
    }
    acc.push({ name });
    return acc;
  };

  const findWriteMethods = (acc, field) => {
    const { name, inputs, type, stateMutability } = field;
    const isViewable = stateMutability === 'view';
    const isPure = stateMutability === 'pure';
    const isMethod = type === 'function';
    if (isViewable || !isMethod || isPure) {
      return acc;
    }
    acc.push({ name, inputs });
    return acc;
  };
  const read = _.reduce(abi, findReadMethods, []);
  const write = _.reduce(abi, findWriteMethods, []);
  return {
    read,
    write,
  };
}

export function getReadMethodsWithNoInputs(abi) {
  const methods = getMethods(abi);
  return methods.read;
}

export function getWriteMethods(abi) {
  const methods = getMethods(abi);
  return methods.write;
}

export function getReadMethods(abi) {
  const methods = getMethods(abi);
  return methods.read;
}
