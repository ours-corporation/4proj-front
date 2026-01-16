
export const convertFileSize = (size: number): string => {
    const sizeStr = size.toString();
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    let fileSize = parseFloat(sizeStr);

    while (fileSize >= 1024 && index < units.length - 1) {
        fileSize /= 1024;
        index++;
    }

    return `${fileSize.toFixed(2)} ${units[index]}`;
};