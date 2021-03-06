// helpers
const { hasOwnProperty } = Object.prototype;

// closure
const StoredProcesses = {};

const createDispatch = (processName, config) => ({
    type: '@@process/RUN_PROCESS',
    config,
    name: processName,
});

const GetProcess = (processName) => {
    if (hasOwnProperty.call(StoredProcesses, processName)) {
        return StoredProcesses[processName];
    }

    return null;
};

const GenerateProcess = (processName, config) => {
    /*
        Runs a process from the config file
    */

    if (hasOwnProperty.call(StoredProcesses, processName)) {
        return createDispatch(processName, config);
    }

    console.warn(`Process: '${processName}' does not exist.`);

    return { type: '@@process/PROCESS_DNE', processName };
};

const CreateProcess = (config) => {
    /*
        Creates a new process from a config file
    */

    const processName = config.name;

    const build = (defaults) => {
        if (hasOwnProperty.call(StoredProcesses, processName)) {
            return false; // process already exists
        }

        StoredProcesses[processName] = {};
        StoredProcesses[processName].name = config.name;
        StoredProcesses[processName].method = config.method;
        StoredProcesses[processName].request = config.request;
        StoredProcesses[processName].requiredProps = config.requiredProps || [];
        StoredProcesses[processName].success = config.success || defaults.success;
        StoredProcesses[processName].error = config.error || defaults.error;

        StoredProcesses[processName].types = {};
        StoredProcesses[processName].types.base = config.type;
        StoredProcesses[processName].types.init = `${config.type}@START`;
        StoredProcesses[processName].types.error = `${config.type}@FAIL`;
        StoredProcesses[processName].types.success = `${config.type}@SUCCESS`;

        return {
            processName,
            __IsReduxProcess: true,
        };
    };

    return {
        build,
        name : processName
    };
};

export {
    GetProcess,
    CreateProcess,
    GenerateProcess,
};
