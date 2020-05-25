const userCollection = (() => {
  var users = [];
  var filteredUsers = [];

  const loading = document.querySelector('#load-segment');
  const loadAnimation = document.querySelector('#load-animation');
  const searchContainer = document.querySelector('#search-container');

  const searchUserInput = document.querySelector('#search-input');
  const searchButton = document.querySelector('#search-button');

  const userList = document.querySelector('#user-list');
  const foundUserQuantity = document.querySelector('#found-user-quantity');
  foundUserQuantity.textContent = 0;

  const content = document.querySelector('#content');

  let foundMaleQuantity = document.querySelector('#found-male-quantity');
  foundMaleQuantity.textContent = 0;

  let foundFemaleQuantity = document.querySelector('#found-female-quantity');
  foundFemaleQuantity.textContent = 0;

  let sumAge = document.querySelector('#sum-age');
  sumAge.textContent = 0;
  let averageAge = document.querySelector('#average-age');
  averageAge.textContent = 0;

  const fetchUsers = async () => {
    //setTimeout used so it is possible to see the loading animation
    setTimeout(async () => {
      try {
        const res = await fetch(
          'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
        );

        const json = await res.json();

        loading.parentNode.removeChild(loading);
        searchContainer.classList.remove('not-visible');

        if (res.status === 200) {
          users = json.results.map((user) => {
            const { name, picture, dob, gender } = user;

            return {
              name: `${name.first} ${name.last}`,
              picture: picture.thumbnail,
              age: dob.age,
              gender,
            };
          });
        } else {
          let errorItem = `
					<div class="ui horizontal segment">
						<h1> ${res.status} </h1>
						<p> Um erro ocorreu, por favor, contate o administrador do sistema </p>
					</div>
					`;

          return (content.innerHTML += errorItem);
        }
      } catch (error) {
        console.log(error);
        loadAnimation.parentNode.removeChild(loadAnimation);

        let errorItem = `
						<h1> =( </h1>
						<h1> Falha na conexão com o servidor, contate o administrador do sistema </h1>	
					`;

        return (loading.innerHTML += errorItem);
      }
    }, 500);
  };

  const _averageAge = () => {
    if (filteredUsers.length > 0) {
      averageAge.textContent = (
        Number(sumAge.textContent, 2) / filteredUsers.length
      ).toFixed(2);
    } else {
      averageAge.textContent = 0;
    }
  };

  const _handleSearch = () => {
    filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchUserInput.value.toLowerCase())
    );

    foundUserQuantity.textContent = filteredUsers.length;
    foundMaleQuantity.textContent = filteredUsers.filter(
      (user) => user.gender == 'male'
    ).length;

    foundFemaleQuantity.textContent = filteredUsers.filter(
      (user) => user.gender == 'female'
    ).length;

    sumAge.textContent = filteredUsers.reduce((acc, cur) => acc + cur.age, 0);

    _averageAge();

    _renderList();
  };

  const _handleButton = (event) => {
    if (searchUserInput.value === '') {
      searchButton.setAttribute('disabled', true);
    } else {
      searchButton.removeAttribute('disabled');
    }
  };

  const _renderList = () => {
    userList.innerHTML = '';
    filteredUsers.forEach((user) => {
      const { name, picture, age } = user;
      let item = `
      <div class="item">
      <img class="ui avatar image" src="${picture}">
      <div class="content">
        <p class="header">${name}</p>
        <div class="description">Age: ${age}</div>
      </div>
      </div>
      `;

      userList.innerHTML += item;
    });
  };

  const render = () => {
    _renderList();
  };

  searchButton.addEventListener('click', _handleSearch);

  searchUserInput.addEventListener('keyup', (event) => {
    if (searchUserInput.value !== '') {
      if (event.key == 'Enter' || event.key == 13) {
        _handleSearch();
      }
    }
  });

  searchUserInput.addEventListener('input', _handleButton);

  return {
    render,
    fetchUsers,
  };
})();

window.addEventListener('load', async () => {
  await userCollection.fetchUsers();
  userCollection.render();
});
