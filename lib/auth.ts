import { GithubAuthProvider, User, UserInfo } from 'firebase/auth'

export const retrieveGitHubProfile = (user: User): UserInfo | undefined => {
  return user.providerData.find(profile => profile.providerId === GithubAuthProvider.PROVIDER_ID)
}
