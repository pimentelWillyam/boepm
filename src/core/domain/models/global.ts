export default interface GlobalRepository {
  username: string | null
  saveUsername: (u: string) => void
}
