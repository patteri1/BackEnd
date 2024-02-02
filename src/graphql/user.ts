import bcrypt from 'bcrypt'
import { User, UserRole } from "../model"

export const typeDef = `
  extend type Mutation {
    addUser(input: AddUserInput!): User!
  }

  input AddUserInput {
    username: String!
    password: String!
    roleId: Int!
  }

  type User {
    id: Int!
    username: String!
    role: UserRole!
  }

  type UserRole {
    id: Int!
    name: String!
  }
`

interface AddUserInput {
	username: string
	password: string
	roleId: number
}

export const resolvers = {
	Mutation: {
		addUser: async (_: unknown, { input }: { input: AddUserInput }) => {
			const { username, password, roleId } = input

			// Hash the password
			const saltRounds: number = 10
			const passwordHash: string = await bcrypt.hash(password, saltRounds)

			// find the role
			const role = await UserRole.findByPk(roleId);
			if (!role) {
				throw new Error(`Role with ID ${roleId} not found`);
			}

			// Add new user to the database
			const user: User = await User.create({
				username,
				passwordHash,
				UserRoleId: roleId
			})

			return {
				id: user.id,
				username: user.username,
				role: {
					id: role.id,
					name: role.name,
				}
			}
		}
	},
};
