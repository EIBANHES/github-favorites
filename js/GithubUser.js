export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint) //asyncrono -> retornando promessa
      .then(data => data.json()) //string para json
      .then(({ login, name, public_repos, followers }) => ({ // desestruturação
        login,
        name,
        public_repos,
        followers
      }))
  }
}