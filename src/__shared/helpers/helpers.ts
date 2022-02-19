import { FileType } from '../enums/enums';

export const shuffle = (arr:Array<any>):Array<any> => {
    arr.sort(()=> Math.random() - 0.5);
    return arr;
}


export const getFileType = (extension:string):FileType => {
    switch (extension) {
        case 'png':
            return FileType.IMAGE;
        case 'jpg':
            return FileType.IMAGE;
        case 'jpeg':
            return FileType.IMAGE;
        case 'mp3':
            return FileType.AUDIO;
        case 'mp4':
            return FileType.VIDEO;
        case 'mov':
            return FileType.VIDEO;
        default:
            return FileType.NO_FILE;

    }
}

export const updateHelpCoolDown = (cd: number = 7):Date => {
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + cd);
    return currentDate;
}

export const isEmptyObject = (obj: object):boolean => {
    return !(Object.keys(obj).length > 0);
}

export const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

export const firstDateBigger = (fistDate: Date, secondDate: Date = new Date()): boolean => {
    fistDate = new Date(fistDate);
    secondDate = new Date(secondDate);
    return fistDate.getTime() > secondDate.getTime();
}

