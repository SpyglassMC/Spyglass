export function attributeNameToIdentity(name: string) {
    return name.replace(/[A-Z]/g, match => `_${match.toLowerCase()}`)
}
