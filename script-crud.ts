interface Tarefa {
  descricao: string;
  concluida: boolean;
}

interface EstadoAplicacao {
  tarefas: Tarefa[];
  tarefaSelecionada: Tarefa | null;
}

let estadoInicial: EstadoAplicacao = {
  tarefas: [
    {
      descricao: 'Tarefa concluída',
      concluida: true
    },
    {
      descricao: 'Tarefa pendente 1',
      concluida: false
    },
    {
      descricao: 'Tarefa pendente 2',
      concluida: false
    }
  ],
  tarefaSelecionada: null
}

const selecionarTarefa = (estado: EstadoAplicacao, tarefa: Tarefa): EstadoAplicacao => {

  return {
    ...estado,
    tarefaSelecionada: tarefa === estado.tarefaSelecionada ? null : tarefa
  }
}

const adicionarTarefa = (estado: EstadoAplicacao, tarefa: Tarefa): EstadoAplicacao => {
  return {
    ...estado,
    tarefas: [...estado.tarefas, tarefa]
  }
}

const atualizarUI = () => {
  const taskIconSvg = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
        fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF" />
        <path
            d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
            fill="#01080E" />
    </svg>
  `
  const ulTarefas = document.querySelector('.app__section-task-list');
  const formAdicionarTarefa = document.querySelector<HTMLFormElement>('.app__form-add-task');
  const btnAdicionarTarefa = document.querySelector<HTMLButtonElement>('.app__button--add-task');
  const textarea = document.querySelector<HTMLTextAreaElement>('.app__form-textarea')

  if (!btnAdicionarTarefa) {
    throw new Error("O elemento btnAdicionarTarefa não foi encontrado, reveja o código");
  }

  //Botao Adicionar Tarefa
  btnAdicionarTarefa.onclick = () => {
    //"classList.toogle verifica se existe class hidden, se existir ele remove, e se não existir ele adiciona"
    formAdicionarTarefa?.classList.toggle('hidden');
  }

  //Formulario
  // "!" Diz para o Typescript que este elemento existe com certeza
  formAdicionarTarefa!.onsubmit = (evento) => {
    evento.preventDefault();            //Não faz o reload da página ao realizar o "submit" do formulario
    const descricao = textarea!.value;  //"!" novamente para confirmar que o elemento e existe, parando o erro de "descricao"
    estadoInicial = adicionarTarefa(estadoInicial, {
      descricao,
      concluida: false
    })
    textarea!.value = '';
    atualizarUI()
  }

  if (ulTarefas) {
    ulTarefas.innerHTML = '';
  }

  estadoInicial.tarefas.forEach(tarefa => {
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svgIcon = document.createElement('svg');
    svgIcon.innerHTML = taskIconSvg;

    const paragraph = document.createElement('p');
    paragraph.classList.add('app__section-task-list-item-description');
    paragraph.textContent = tarefa.descricao;

    const button = document.createElement('button');
    button.classList.add('app_button-edit');

    const editIcon = document.createElement('img');
    editIcon.setAttribute('src', '/imagens/edit.png');

    button.appendChild(editIcon);

    if (tarefa.concluida) {
      button.setAttribute('disabled', 'true')
      li.classList.add('app__section-task-list-item-complete')
    }

    li.appendChild(svgIcon)
    li.appendChild(paragraph)
    li.appendChild(button)

    ulTarefas?.append(li);
  })
}

atualizarUI();