import { readFile } from "fs/promises";

export interface DBConfig {
    host: string,
    username: string,
    password: string
}

interface ApiConfig {
    host: string,
    port: number,
    key: string
}

export interface AppConfig {
    db: DBConfig,
    api: ApiConfig,
    quirks: string[],
    occupations: string[]
}

export class ConfigurationError extends Error {
    constructor(missing: string) {
        super(`Invalid Configuration: missing value(s) ${missing}`)
    }
}

export async function readConfig(filepath: string): Promise<AppConfig> {
    let raw = JSON.parse((await readFile(filepath)).toString());
    let dbConfig = raw.db as Record<string, string>;
    if (!dbConfig) {
        throw new ConfigurationError('db')
    }
    let apiConfig = raw.api as Record<string, string | number>;
    if (!apiConfig) {
        throw new ConfigurationError('api')
    }
    let quirksFile = raw.quirksLocation
    let quirks = ["none"]
    if (quirksFile) {
        quirks = JSON.parse((await readFile(quirksFile)).toString())
    }
    let occupationsFile = raw.occupationsLocation
    let occupations = ["child", "unemployed"]
    if (occupationsFile) {
        occupations = JSON.parse((await readFile(occupationsFile)).toString())
    }

    return {
        db: parseDBConfig(dbConfig),
        api: parseApiConfig(apiConfig),
        quirks,
        occupations
    }
}

function parseDBConfig(config: Record<string, string>): DBConfig {
    let missing = []
    let host = coerceString(config.host)
    if (!host) { missing.push('db.host') }
    let username = coerceString(config.username)
    if (!username) { missing.push('db.username') }
    let password = process.env.MYSQL_PASSWORD
    if (!password) { missing.push('env.MYSQL_PASSWORD') }
    if (missing.length != 0) {
        throw new ConfigurationError(missing.join(', '))
    }
    return {
        host: host!, username: username!, password: password!
    }
}

function parseApiConfig(config: Record<string, string|number>): ApiConfig {
    let missing = []
    let host = coerceString(config.host)
    if (!host) { missing.push('api.host') }
    let key = process.env.API_KEY
    if (!key) { missing.push('env.API_KEY') }
    let port = coerceNumber(config.port) ?? 80
    if (missing.length != 0) {
        throw new ConfigurationError(missing.join(', '))
    }
    return {
        host: host!, port: port, key: key!
    }
}

function coerceString(value: any): string | null {
    if (typeof value == 'string') {
        return value as string
    }
    return null;
}

function coerceNumber(value: any): number | null {
    if (typeof value == 'number') {
        return value as number
    }
    return null
}