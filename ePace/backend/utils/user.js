// list of users connected
const users = [];

/**
 * Joins User to the users array.        
 * @param {string} username - the username of the user to add.           
 * @param {string} channel - the channel that the user is in.           
 * @param {string} email - the email of the user.           
 * @returns {User} - the user object.           
 */
function userJoin(username, channel, email) {
    const user = {username, channel, email};
    users.push(user);
    return user;
}

/**
 * Gets current user.      
 * @param {string} username - the username of the user to find.           
 * @param {string} channel - the channel of the user to find.           
 * @param {string} email - the email of the user to find.           
 * @returns {User} - the user object.           
 */
function getUser(username, channel, email) {
    return users.find(user => user.username === username && user.channel === channel && user.email === email);
}

/**
 * Handles user leaving.
 * @param {string} username - The username of the user to remove.
 * @param {string} channel - The channel of the user to remove.
 * @param {string} email - The email of the user to remove.
 * @returns The user that was removed.
 */
function userLeave(username, channel, email) {
    const index = users.findIndex(user => user.username === username && user.channel === channel && user.email === email);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

/**
 * Returns all users in the given channel.       
 * @param {string} channel - the channel to get all users from.       
 * @returns {User[]} - an array of all users in the given channel.       
 */
function getAllUser(channel) {
    return users.filter(user => user.channel === channel);
}

module.exports = { userJoin, getUser, userLeave , getAllUser};