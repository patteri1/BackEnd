// returns dd.mm.yyyy hh:mm:ss
export function formatDateTime(createdAt: string) {
        const dateTime = new Date(`${createdAt}`)
        // todo: check if handles dst correctly
        const date = dateTime.toLocaleDateString('fi-FI', {timeZone: 'Europe/Helsinki'})
        const time = dateTime.toLocaleTimeString('en-GB', {timeZone: 'Europe/Helsinki'})
        return `${date} ${time}`
}