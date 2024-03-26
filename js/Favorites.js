export class Favorites {
  constructor(root) { // div#app
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    //localstorage, JSON.parse() -> string para objeto
    // verifica se tem valor no localStorage, caso nao tenha, retorna um Array vazio
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    console.log(this.entries);
  }

  delete(user) {
    const filteredEntries = this.entries
      .filter((entrie) => entrie.login !== user.login) // se for igual, remove, se for diferente, mantem no array
    console.log(user);
    this.entries = filteredEntries
    this.update()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    // vai para dentro do constructor no Favorites e vai buscar o root
    super(root)
    this.tbody = document.querySelector('table tbody');
    this.update()
  }

  // vai ser chamada várias vezes
  update() {
    this.removeAllTr()
    this.entries.forEach(user => {
      const row = this.createRow()
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
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

  createRow() {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td class="user">
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
}