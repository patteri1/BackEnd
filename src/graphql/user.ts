import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { User, UserRole } from "../model"

export const typeDef = `
  extend type Mutation {
    addUser(input: AddUserInput!): User!
	login(username: String!, password: String!): AuthPayload!
  }

  input AddUserInput {
    username: String!
    password: String!
    roleId: Int!
  }

  type AuthPayload {
	token: String!
	user: User!
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
		},

		login: async (_:unknown, { username, password }: {username: string, password: string}) => {
			const user: User | null = await User.findOne({ where: { username }})
			if (!user) {
				throw new Error('User not found')
			}

			// check the password is correct
			const valid: boolean = await bcrypt.compare(password, user.passwordHash)
			if (!valid) {
				throw new Error('Invalid password')
			}

			// generate an authentication token
			const secretKey: string = process.env.SECRET!
			const token: string = jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '1h' })

			return {
				token,
				user: {
					id: user.id,
					username: user.username,
					role: await user.getUserRole(),
				}
			}
		}
	},
};
