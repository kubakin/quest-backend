export enum Role {
    User = 'user',
    Admin = 'admin',
}

export enum FileType {
    AUDIO = 'audio',
    IMAGE = 'image',
    VIDEO = 'video',
    NO_FILE = 'noFile',
}

export enum Status  {
    PROGRESS = 'IN_PROGRESS',
    FINISHED = 'FINISHED',
    ACTIVATED  = 'ACTIVATED',
    NOT_ACTIVATED = 'NOT_ACTIVATED',
}

export enum StatusGame {
    NOT_STARTED,
    STARTED,
    FINISHED,
    TEST
}
