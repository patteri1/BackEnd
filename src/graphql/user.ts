import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { User, UserRole } from "../model"
import { checkAdmin } from './util/authorizationChecks'

export const typeDef = `
  extend type Mutation {
    addUser(input: AddUserInput!): User!
	changePassword(userId: Int!, password: String!): User!
	login(username: String!, password: String!): AuthPayload!
	deleteUser(id: Int!): User!
  }

  extend type Query {
	usersByLocationId(locationId: Int!): [User]!
  }

  input AddUserInput {
    username: String!
    password: String!
    userRoleId: Int!
	locationId: Int!
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
	locationId: number
}

export const resolvers = {
	Mutation: {
		addUser: async (_: unknown, { input }: { input: AddUserInput }, context: { user?: any }) => {
			// check that the user has the admin role
			checkAdmin(context)
		  
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
				userRoleId: userRoleId,
				locationId: input.locationId
			})

			return {
				userId: user.userId,
				username: user.username,
				locationId: user.locationId,
				userRole: {
					userRoleId: role.userRoleId,
					roleName: role.roleName,
				}
			}
		},

		login: async (_: unknown, { username, password }: { username: string, password: string }) => {
			const user: User | null = await User.findOne({ where: { username } })
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
		},
		deleteUser: async (_: unknown, { id }: { id: number }) => {
			try {
				const userToDelete = await User.findByPk(id)

				if (!userToDelete) {
					throw new Error(`User with id: ${id} not found`)
				}

				await userToDelete.destroy()
				return userToDelete

			} catch (error) {
				throw new Error(`Unable to delete user by id: ${id}`)
			}
		},
		changePassword: async (_: unknown, { userId, password }: { userId: number, password: string }) => {
			try {
				const userToUpdate = await User.findByPk(userId)
				if (!userToUpdate) {
					throw new Error('User not found')
				}
				const saltRounds: number = 10
				const passwordHash: string = await bcrypt.hash(password, saltRounds)

				userToUpdate.passwordHash = passwordHash
				await userToUpdate.save()
				return userToUpdate

			} catch (error) {
				throw new Error('Failed to change the password')
			}
		}
	},

	Query: {
		usersByLocationId: async (_: unknown, { locationId }: { locationId: number }) => {
			try {
				const users = await User.findAll({
					where: {
						locationId: locationId
					}
				})
				return users
			} catch (error) {
				throw new Error('Error retrieving users by locationId')
			}
		}
	}
}
