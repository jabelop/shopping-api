import UserDTO from '../../../../libs/shared/src/application/user/userdto';
import UserInterface from '../../../../libs/shared/src/domain/user/user' ;
import Id from '../../../../libs/shared/src/domain/valueobjects/id';
import Password from '../../../../libs/shared/src/domain/valueobjects/password';
import UserName from '../../../../libs/shared/src/domain/valueobjects/username';

export default class User implements UserInterface {
    id: string;
    username: string;
    password: string;

    constructor(id: string, username: string, password: string) {
        this.id = new Id(id).value;
        this.username = new UserName(username).value;
        this.password = new Password(password).value;
    } 

    public static getUserFromDTO(user: UserDTO): User {
        return new User(user.id, user.username, user.password);
    } 
}