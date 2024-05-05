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
    userRoleId: Int!
  }

  type AuthPayload {
	token: String!
	user: User!
  }

  type User {
    userId: Int!
    username: String!
    userRole: UserRole!
	location: Location!
  }

  type UserRole {
    userRoleId: Int!
    roleName: String!
  }
`

interface AddUserInput {
	username: string
	password: string
	userRoleId: number
}

export const resolvers = {
	Mutation: {
		addUser: async (_: unknown, { input }: { input: AddUserInput }, context: { user?: any }) => {
			// check that the user has the admin role
			// TODO: This could be improved
			if (!context.user || context.user.userRoleId !== 1) { 
			  	throw new Error('Invalid token');
			}
		  
			const { username, password, userRoleId } = input

			// Hash the password
			const saltRounds: number = 10
			const passwordHash: string = await bcrypt.hash(password, saltRounds)

			// find the role
			const role = await UserRole.findByPk(userRoleId);
			if (!role) {
				throw new Error(`Role with ID ${userRoleId} not found`);
			}

			// Add new user to the database
			const user: User = await User.create({
				username,
				passwordHash,
				userRoleId: userRoleId
			})

			return {
				userId: user.userId,
				username: user.username,
				userRole: {
					userRoleId: role.userRoleId,
					roleName: role.roleName,
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
			const token: string = jwt.sign({ 
				userId: user.userId, 
				username: user.username,
				userRoleId:  user.userRoleId,
				locationId: user.locationId,
			}, process.env.SECRET!, { expiresIn: 60*60 }) // one hour

			return {
				token,
				user: {
					userId: user.userId,
					username: user.username,
					userRole: await user.getUserRole(),
					location: await user.getLocation()
				}
			}
		}
	},
}
