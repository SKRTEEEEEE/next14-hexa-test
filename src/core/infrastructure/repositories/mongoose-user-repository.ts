import { User } from '@/core/domain/entities/User';
import { UserRepository } from '@/core/domain/repositories/user-repository';
import { UserDocument, UserModel } from '@/models/user-role-schema';
import { MongoDbConnection } from '../adapters/mongo-db-connection';


export class MongooseUserRepository extends MongoDbConnection implements UserRepository {

    async create(user: User): Promise<User> {
        await this.connect();
        const newUser = new UserModel(user)
        const savedUser = await newUser.save()
        console.log("savedUser: ",savedUser)
        return this.documentToUser(savedUser)

    }
    async findById(id: string): Promise<User | null> {
        await this.connect()
        const user = await UserModel.findById(id)
        return user ? this.documentToUser(user) : null
    }
    async update(id: string, address: string,isAdmin:boolean, solicitudAdmin:boolean, nick?: string, roleId?:string): Promise<User> {
        await this.connect(); // Asegúrate de que la conexión esté establecida
        console.log("update nick: ", nick)
        console.log("update roleId: ", roleId)
        // Busca el usuario por su ID
        const user = await UserModel.findById(id);
        if (!user) throw new Error("Error al encontrar el usuario");
    
        // Actualiza los campos necesarios
        user.address = address;
        user.isAdmin = isAdmin;
        user.solicitudAdmin = solicitudAdmin;
        user.nick = nick !== undefined ? nick : user.nick
        user.roleId = roleId !== null ? roleId : user.roleId; // Mantiene el valor actual si roleId no se proporciona
        user.updatedAt = Date.now(); // Actualiza la fecha de modificación como timestamp
        console.log("update user: ", user)
        // Guarda los cambios en la base de datos
        const updatedUser = await user.save();
        console.log("updated user: ",updatedUser)
        return this.documentToUser(updatedUser); // Convierte el documento actualizado a la entidad User
    }
    async delete(id:string):Promise<void> {
        await this.connect()
        const result = await UserModel.deleteOne({_id:id})
        if (result.deletedCount === 0) throw new Error(`User with id ${id} not found`);
    }
    async findAll(): Promise<User[] | null> {
        await this.connect()
        const users = await UserModel.find()
        return users.length > 0 ? users.map(this.documentToUser):null
    }
    async deleteRoleId(id: string): Promise<void> {
        await this.connect()
        const result = await UserModel.updateOne({ _id: id }, { $set: { roleId: null } });
        if (result.matchedCount === 0) throw new Error(`User with id ${id} not found`);
    }
    private documentToUser(doc: UserDocument): User {
        return {
          id: doc._id.toString(),
          address: doc.address,
          nick: doc.nick,
          roleId: doc.roleId,
          isAdmin: doc.isAdmin,
          solicitudAdmin: doc.solicitudAdmin,
          createdAt: doc.createdAt.toISOString(),
          updatedAt: doc.updatedAt.toISOString()
        };
      }

}