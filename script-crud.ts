interface Tarefa {
  descricao: string;
  concluida: boolean;
}

interface EstadoAplicacao {
  tarefas: Tarefa[];
  tarefaSelecionada: Tarefa | null;
  editando: boolean;
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
  tarefaSelecionada: null,
  editando: false
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

const deletarTarefa = (estado: EstadoAplicacao): EstadoAplicacao => {
  if (estado.tarefaSelecionada) {
    const tarefas: Tarefa[] = estado.tarefas.filter(tarefa => tarefa != estado.tarefaSelecionada);
    return { ...estado, tarefas, tarefaSelecionada: null, editando: false };
  } else {
    return estado;
  }
}

const deletarTodasTarefas = (estado: EstadoAplicacao): EstadoAplicacao => {
  return { ...estado, tarefas: [], tarefaSelecionada: null, editando: false }
}

const deletarTarefasConcluidas = (estado: EstadoAplicacao): EstadoAplicacao => {
  const tarefas: Tarefa[] = estado.tarefas.filter(tarefa => !tarefa.concluida);
  return { ...estado, tarefas, tarefaSelecionada: null, editando: false };
}

// Modifica o estado para entrar no modo de edição. Retorna um novo estado.
const editarTarefa = (estado: EstadoAplicacao, tarefa: Tarefa): EstadoAplicacao => {
  return { ...estado, editando: !estado.editando, tarefaSelecionada: tarefa };
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
  const textarea = document.querySelector<HTMLTextAreaElement>('.app__form-textarea');
  const labelTarefaAtiva = document.querySelector<HTMLParagraphElement>('.app__section-active-task-description');
  const btnDeletarTodasTarefas = document.querySelector<HTMLButtonElement>('#btn-remover-todas');
  const btnDeletarTarefasConcluidas = document.querySelector<HTMLButtonElement>('#btn-remover-concluidas');
  const labelForm = document.querySelector('.app__form-label') as HTMLLabelElement;  

  //Se existir tarefa selecionada e não estiver concluida, ele altera a label para a "descricao" da tarefa selecionada.
  labelTarefaAtiva!.textContent =
    estadoInicial.tarefaSelecionada && !estadoInicial.tarefaSelecionada.concluida ? estadoInicial.tarefaSelecionada.descricao : null;

  if (!btnAdicionarTarefa) {
    throw new Error("O elemento btnAdicionarTarefa não foi encontrado, reveja o código");
  }

  //Botao Adicionar Tarefa
  btnAdicionarTarefa.onclick = () => {
    //"classList.toogle verifica se existe class hidden, se existir ele remove, e se não existir ele adiciona"
    formAdicionarTarefa?.classList.toggle('hidden');
  }

  btnDeletarTodasTarefas!.onclick = () => {
    estadoInicial = deletarTodasTarefas(estadoInicial);
    atualizarUI();
  }

  btnDeletarTarefasConcluidas!.onclick = () => {
    estadoInicial = deletarTarefasConcluidas(estadoInicial);
    atualizarUI();
  }

  if (estadoInicial.editando && estadoInicial.tarefaSelecionada) {
    formAdicionarTarefa!.classList.remove('hidden');
    labelForm.textContent = 'Editando tarefa';
    textarea!.value = estadoInicial.tarefaSelecionada.descricao;
  } else {
    formAdicionarTarefa!.classList.add('hidden');
    labelForm.textContent = 'Adicionando tarefa';
    textarea!.value = '';
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
    atualizarUI();
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
      button.setAttribute('disabled', 'true');
      li.classList.add('app__section-task-list-item-complete');
    }

    if (tarefa == estadoInicial.tarefaSelecionada) {
      if (!tarefa.concluida) {
        li.classList.add('app__section-task-list-item-active')

        editIcon.onclick = (evento) => {
          evento.stopPropagation(); //Faz com o click não afete outros elementos, evitando a propagação de eventos sobre outros elementos
          estadoInicial = editarTarefa(estadoInicial, tarefa);
          atualizarUI();
        }
      }
    }

    li.appendChild(svgIcon);
    li.appendChild(paragraph);
    li.appendChild(button);

    li.addEventListener('click', () => {
      estadoInicial = selecionarTarefa(estadoInicial, tarefa);
      atualizarUI();
    })

    ulTarefas?.append(li);
  })
}

atualizarUI();