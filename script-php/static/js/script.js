function editField(element) {
    const id = element.id;
    const value = element.innerText;
    element.innerHTML = `<input id="${id}_input" type="text" value="${value}" onblur="saveField(this)">`;
    const input = document.getElementById(`${id}_input`);
    input.focus();
  }


  function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/login");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function() {
    if (xhr.status === 200) {
    // Login bem-sucedido
    console.log("Login bem-sucedido");
    } else {
    // Login falhou
    console.error("Login falhou");
    }
    };
    xhr.send("username=" + username + "&password=" + password);
    }
  

function showSucessToast() {
  toastr.success('Linha incluida com sucesso');
  toastr.options.positionClass = "toast-bottom-right";
}
function showDeleteToast() {
  toastr.success('Linha deletada com sucesso');
  toastr.options.positionClass = "toast-bottom-right";
  toastr.options.progressBar = true;
  toastr.options.closeButton = true;
  toastr.options.toastClass = "toast-success";
  toastr.options.backgroundColor = "#FF0000";
}
function showAlterToast() {
  toastr.success('Linha alterada com sucesso');
  toastr.options.positionClass = "toast-bottom-right";
}

function deleteField(id) {
if (confirm('Tem certeza que deseja excluir este registro?')) {
const xhr = new XMLHttpRequest();
xhr.open('POST', '/deletar');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onload = function() {
if (xhr.status === 200) {
const element = document.getElementById(id);
element.parentNode.removeChild(element);
console.log('Registro deletado com sucesso');
showDeleteToast() 
} else {
console.log('Erro ao deletar registro');
}
};
xhr.send(JSON.stringify({
id: id
}));
}}

function addRow() {
  const campo1 = document.getElementById('add-field1').value;
  const campo2 = document.getElementById('add-field2').value;
  const campo3 = document.getElementById('add-field3').value;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/incluir');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      location.reload(showSucessToast());
      const id = response.id;
      const tbody = document.querySelector('table tbody');
      const tr = document.createElement('tr');
      tr.id = id;
      tr.innerHTML = `
        <td>${id}</td>
        <td class="editField" id="campo1_${id}" ondblclick="editField(this)">${campo1}</td>
        <td class="editField" id="campo2_${id}" ondblclick="editField(this)">${campo2}</td>
        <td class="editField" id="campo3_${id}" ondblclick="editField(this)">${campo3}</td>
        <td>
          <button class="btn btn--success" onclick="updateField(${id})">S</button><br><br>
          <button class="btn btn--danger" onclick="deleteField(${id})">E</button>
        </td>
      `;
      tbody.appendChild(tr);
    } else {
      console.log('Erro ao incluir registro');
    }
  };
  xhr.send(JSON.stringify({
    campo1: campo1,
    campo2: campo2,
    campo3: campo3
  }));
}




  function saveField(input) {
    const id = input.id.replace('_input', '');
    const value = input.value;
    const element = document.getElementById(id);
    element.innerHTML = value;
  }

  function updateField(id) {
    const campo1 = document.getElementById(`campo1_${id}`).innerText;
    const campo2 = document.getElementById(`campo2_${id}`).innerText;
    const campo3 = document.getElementById(`campo3_${id}`).innerText;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/atualizar');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log('Registro atualizado com sucesso');
        showAlterToast();
      } else {
        console.log('Erro ao atualizar registro');
        console.log(id,campo1,campo2)
      }
    };
    xhr.send(JSON.stringify({
      id: id,
      campo1: campo1,
      campo2: campo2,
      campo3: campo3
    }));
  }