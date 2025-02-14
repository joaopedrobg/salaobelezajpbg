// script.js

// Aguarda o documento HTML ser carregado antes de executar o código
document.addEventListener('DOMContentLoaded', function() {
    // Obtém o formulário de agendamento
    const formularioAgendamento = document.getElementById('formulario-agendamento');
  
    // Adiciona um ouvinte de evento para o envio do formulário
    formularioAgendamento.addEventListener('submit', function(event) {
      // Impede o envio padrão do formulário
      event.preventDefault();
  
      // Obtém os valores dos campos do formulário
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const telefone = document.getElementById('telefone').value;
      const servico = document.getElementById('servico').value;
      const produtos = Array.from(document.getElementById('produtos').selectedOptions).map(option => option.value);
  
      // Valida os campos do formulário (opcional)
      if (nome === '' || email === '' || telefone === '') {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
  
      // Cria um objeto com os dados do agendamento
      const dadosAgendamento = {
        nome: nome,
        email: email,
        telefone: telefone,
        servico: servico,
        produtos: produtos
      };
  
      // Envia os dados para o servidor (ou para o Google Agenda)
      enviarDadosAgendamento(dadosAgendamento);
    });
  
    // Função para enviar os dados do agendamento para o servidor
    function enviarDadosAgendamento(dados) {
      // Aqui você pode usar fetch ou XMLHttpRequest para enviar os dados para o seu servidor
      // ou integrar com a API do Google Agenda.
  
      // Exemplo usando fetch:
      fetch('/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      })
      .then(response => response.json())
      .then(data => {
        alert('Agendamento realizado com sucesso!');
        formularioAgendamento.reset();
      })
      .catch(error => {
        alert('Erro ao agendar. Por favor, tente novamente mais tarde.');
        console.error('Erro:', error);
      });
    }

    // Função para criar evento na agenda do Google
  function criarEventoNaAgenda(dados) {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: 'SUA_CHAVE_DE_API',
        clientId: 'SEU_ID_DO_CLIENTE',
        discoveryDocs: ['https://google.github.io/google-api-javascript-client/docs/discovery.html'],
        scope: 'https://developers.google.com/calendar/api/auth'
      }).then(() => {
        if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
          gapi.auth2.getAuthInstance().signIn().then(() => {
            criarEvento(dados);
          });
        } else {
          criarEvento(dados);
        }
      });

      function criarEvento(dados) {
        gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': {
            'summary': `Agendamento - ${dados.servico}`,
            'description': `Nome: ${dados.nome}\nEmail: ${dados.email}\nTelefone: ${dados.telefone}\nProdutos: ${dados.produtos.join(', ')}`,
            'start': {
              'dateTime': '2024-05-16T10:00:00-03:00' // Defina a data e hora do agendamento
            },
            'end': {
              'dateTime': '2024-05-16T11:00:00-03:00' // Defina a data e hora de término
            }
          }
        }).then(function(response) {
          alert('Agendamento realizado com sucesso!');
        }, function(reason) {
          alert('Erro ao agendar: ' + reason.message);
        });
      }
    });
  }

  criarEventoNaAgenda({ nome, email, telefone, servico, produtos });

});