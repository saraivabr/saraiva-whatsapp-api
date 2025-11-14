# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com a **Saraiva WhatsApp API**! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Código de Conduta

Este projeto adere a um Código de Conduta. Ao participar, você concorda em manter um ambiente respeitoso e acolhedor para todos.

## 🎯 Como Posso Contribuir?

### Reportando Bugs

Antes de reportar um bug, verifique se ele já não foi reportado nos [Issues](https://github.com/saraivabr/saraiva-whatsapp-api/issues).

Ao criar um novo issue de bug, inclua:

- **Descrição clara** do problema
- **Passos para reproduzir** o bug
- **Comportamento esperado** vs **comportamento atual**
- **Screenshots** (se aplicável)
- **Ambiente**:
  - Versão do Node.js
  - Sistema operacional
  - Versão da API

**Template de Bug:**

```markdown
## Descrição
[Descrição clara e concisa do bug]

## Passos para Reproduzir
1. Vá para '...'
2. Execute '...'
3. Veja o erro

## Comportamento Esperado
[O que deveria acontecer]

## Comportamento Atual
[O que está acontecendo]

## Screenshots
[Se aplicável]

## Ambiente
- Node.js: vX.X.X
- SO: [Windows/Linux/Mac]
- Versão da API: vX.X.X
```

### Sugerindo Melhorias

Sugestões de melhorias são bem-vindas! Antes de sugerir:

1. Verifique se já não existe uma sugestão similar
2. Explique claramente o problema que a melhoria resolve
3. Descreva a solução proposta
4. Considere alternativas

### Contribuindo com Código

#### Processo de Desenvolvimento

1. **Fork o Repositório**

```bash
git clone https://github.com/seu-usuario/saraiva-whatsapp-api.git
cd saraiva-whatsapp-api
```

2. **Crie uma Branch**

```bash
git checkout -b feature/minha-feature
# ou
git checkout -b fix/meu-bug-fix
```

Convenções de nomenclatura:
- `feature/` - Para novas funcionalidades
- `fix/` - Para correções de bugs
- `docs/` - Para documentação
- `refactor/` - Para refatoração
- `test/` - Para testes
- `chore/` - Para tarefas de manutenção

3. **Configure o Ambiente**

```bash
npm install
cp .env.example .env
# Edite .env conforme necessário
```

4. **Faça suas Mudanças**

- Escreva código limpo e bem documentado
- Siga os padrões do projeto
- Adicione testes quando apropriado
- Mantenha commits atômicos e descritivos

5. **Teste suas Mudanças**

```bash
npm test
npm run lint
```

6. **Commit suas Mudanças**

Siga a convenção de [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: adiciona suporte para envio de stickers"
git commit -m "fix: corrige erro ao enviar mensagem para grupo"
git commit -m "docs: atualiza README com novas instruções"
```

Tipos de commit:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta código)
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

7. **Push para sua Branch**

```bash
git push origin feature/minha-feature
```

8. **Abra um Pull Request**

- Use um título claro e descritivo
- Descreva as mudanças em detalhes
- Referencie issues relacionadas
- Adicione screenshots se relevante

#### Padrões de Código

**JavaScript/Node.js:**

- Use ES6+ features
- Indentação: 4 espaços
- Use `const` e `let`, evite `var`
- Nomes descritivos de variáveis e funções
- Comentários em português
- JSDoc para funções públicas

**Exemplo:**

```javascript
/**
 * Envia uma mensagem de texto
 *
 * @param {string} instanceKey - Chave da instância
 * @param {string} recipient - Número do destinatário
 * @param {string} message - Texto da mensagem
 * @returns {Promise<Object>} Resultado do envio
 */
async function sendTextMessage(instanceKey, recipient, message) {
    const validation = validatePhoneNumber(recipient);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    // Implementação...
}
```

**Estrutura de Arquivos:**

```
src/
├── api/
│   ├── class/          # Classes principais
│   ├── controllers/    # Controladores
│   ├── middlewares/    # Middlewares
│   ├── routes/         # Rotas
│   ├── helpers/        # Funções auxiliares
│   └── models/         # Modelos
├── config/             # Configurações
└── server.js           # Entry point
```

#### Testes

- Escreva testes para novas funcionalidades
- Mantenha cobertura de testes acima de 80%
- Use nomes descritivos para testes

```javascript
describe('validatePhoneNumber', () => {
    it('deve validar número brasileiro correto', () => {
        const result = validatePhoneNumber('5511999999999');
        expect(result.valid).toBe(true);
    });

    it('deve rejeitar número muito curto', () => {
        const result = validatePhoneNumber('123');
        expect(result.valid).toBe(false);
    });
});
```

## 📝 Processo de Review

1. Pelo menos um maintainer deve revisar o PR
2. Todas as discussões devem ser resolvidas
3. Testes devem passar
4. Código deve seguir os padrões

## 🏆 Reconhecimento

Contribuidores serão reconhecidos no README e terão seus nomes adicionados ao arquivo `CONTRIBUTORS.md`.

## 📞 Dúvidas?

- Abra uma [Discussion](https://github.com/saraivabr/saraiva-whatsapp-api/discussions)
- Entre em contato via email: fellipesaraivabarbosa@gmail.com

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a MIT License.

---

**Obrigado por contribuir! 🎉**
