import User  from "./user";

export interface UserRepository {
    /**
     * save a given user
     * 
     * @param user the user to save
     * 
     * @returns a Promise with true if was saved, false if there was an error
     */
    saveUser(user: User): Promise<boolean>;
    
    /**
     * get a user given their username
     * 
     * @param username the username to look for
     * 
     * @returns a Promise with the user if exists, null if does not
     */
    getUser(username: string): Promise<User | null>;

    /**
     * delete an user if exists
     * 
     * @param user the user to  be deleted
     * 
     * @returns a Promise with true if the user was deleted, false if was not
     */
    deleteUser(user: User): Promise<boolean>;
}

export const UserRepository = Symbol("UserRepository");