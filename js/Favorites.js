import { GithubUser } from "./GithubUser.js"

//Classe que contém a lógica dos dados e como serão estruturados
export class Favorites {
  constructor(root) { // div#app
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    //localstorage, JSON.parse() -> string para objeto
    // verifica se tem valor no localStorage, caso nao tenha, retorna um Array vazio
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries)) // JSON para string
  }

  async add(username) { // avisa que a funcao tera código assíncrono
    // tratamento de erro com async/await
    try {
      const userExists = this.entries.find(entry => entry.login === username) //encontra
      if (userExists) {
        throw new Error('Usuário ja cadastrado!')
      }
      const user = await GithubUser.search(username) //await, espera uma promessa
      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }
      //imutabilidade -> novo array
      this.entries = [user, ...this.entries] //pega todos os usuários, junto com o user vindo primeiro
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries
      .filter((entrie) => entrie.login !== user.login) // se for igual, remove, se for diferente, mantem no array
    console.log(user);
    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

//Classe que contém a visualização e eventos
export class FavoritesView extends Favorites {
  constructor(root) {
    // vai para dentro do constructor no Favorites e vai buscar o root
    super(root)
    this.tbody = document.querySelector('table tbody');
    this.update()
    this.onadd()
  }

  //adicionar usuário
  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')
      this.add(value)
    }
  }

  createRow() {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td class="user">
      <a href="">
        <img src="" alt="" target="_blank">
          <p></p>
          <span></span>
        </a>
      </td>
      <td class="repositories">
        
      </td>
      <td class="followers">
        
      </td>
      <td>
        <button class="remove">&times;</button>
      </td>
    `
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      //remove os tr's
      tr.remove();
    })
  }

  // vai ser chamada várias vezes
  update() {
    this.removeAllTr()
    this.entries.forEach(user => {
      const row = this.createRow()
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar esta linha?')
        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }
}