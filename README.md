# Sistema de Gestão de Clientes

Sistema web desenvolvido em React + TypeScript para gerenciamento de clientes bancários. Consome dados de planilhas Google Sheets e oferece interface responsiva para visualização, busca e detalhamento de informações.

## Funcionalidades

- **Lista Paginada**: Visualização organizada de todos os clientes cadastrados
- **Busca Inteligente**: Filtro por nome, email ou CPF/CNPJ em tempo real
- **Perfil Completo**: Detalhamento de dados pessoais, financeiros e bancários
- **Gestão de Contas**: Visualização de contas correntes e poupanças
- **Informações de Agência**: Dados completos das agências bancárias
- **Interface Responsiva**: Otimizada para desktop, tablet e mobile

## Tecnologias

- **React 18** - Framework JavaScript
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilos utilitários
- **Vite** - Build tool moderna
- **Google Sheets API** - Fonte de dados externa

## Estrutura do Projeto

```
src/
├── components/
│   ├── ListaClientes/
│   │   ├── ClientLista.tsx          # Componente principal da listagem
│   │   ├── ClientCard.tsx           # Card individual do cliente
│   │   ├── ClientFiltro.tsx         # Sistema de busca e filtros
│   │   ├── ClientesDetalhes.tsx     # Página detalhada do cliente
│   │   └── Paginacao.tsx            # Controles de navegação
│   ├── Conta/
│   │   └── ContaCard.tsx            # Exibição de contas bancárias
│   ├── Agencia/
│   │   └── AgenciaInfo.tsx          # Informações da agência
│   └── pages/
│       ├── Home.tsx                 # Página inicial
│       └── PaginaCliente.tsx        # Página específica do cliente
├── hooks/
│   └── useDatas.ts                  # Hooks customizados para gerenciamento de estado
├── services/
│   ├── api.ts                       # Serviço principal da API
├── types/
│   └── index.ts                     # Definições de tipos TypeScript
├── App.tsx                          # Componente raiz da aplicação
├── main.tsx                         # Ponto de entrada React
└── index.css                        # Configuração do Tailwind CSS
```

## Componentes Principais

### `ClientLista.tsx`
Componente orquestrador principal que gerencia:
- Carregamento assíncrono dos dados
- Estado de loading e tratamento de erros
- Sistema de filtros e busca
- Paginação dos resultados
- Navegação entre lista e detalhes

### `ClientCard.tsx`
Card interativo que apresenta:
- Informações essenciais do cliente
- Design responsivo e acessível
- Navegação via clique ou teclado
- Estados visuais de hover e focus

### `ClientesDetalhes.tsx`
Página completa de detalhamento com:
- Dados pessoais e de contato
- Informações financeiras (renda, patrimônio)
- Lista dinâmica de contas bancárias
- Dados da agência associada
- Navegação de retorno à lista

### `ContaCard.tsx`
Exibição formatada de contas com:
- Tipo de conta (corrente/poupança)
- Saldo atual e limites
- Formatação monetária brasileira
- Indicadores visuais de status

## Hooks Customizados

### `useClientes()`
- Gerenciamento de estado dos clientes
- Carregamento assíncrono dos dados
- Sistema de filtros com paginação local
- Tratamento de erros e estados de loading

### `useContas()`
- Busca de contas por CPF/CNPJ do cliente
- Estado de carregamento independente
- Tratamento de erros específico

### `useAgencias()`
- Consulta de agências por código
- Cache de dados para otimização
- Gerenciamento de estado assíncrono

## Integração com API

### `GoogleSheetsService`
Classe que abstrai a comunicação com Google Sheets:
- Parser robusto de CSV
- Tratamento de diferentes formatos de data
- Normalização de dados financeiros
- Mapeamento dinâmico de colunas
- Tratamento de encoding de caracteres

### Estrutura de Dados

```typescript
interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  rg?: string;
  email: string;
  endereco: string;
  dataNascimento: Date;
  nomeSocial?: string;
  rendaAnual: number;
  patrimonio: number;
  estadoCivil: "Solteiro" | "Casado" | "Viúvo" | "Divorciado";
  codigoAgencia: number;
}

interface Conta {
  id: string;
  cpfCnpjCliente: string;
  tipo: "corrente" | "poupanca";
  saldo: number;
  limiteCredito: number;
  creditoDisponivel: number;
}

interface Agencia {
  id: string;
  codigo: number;
  nome: string;
  endereco: string;
}
```
## Padrões de Design

### Responsividade
- Grid system adaptativo (1-5 colunas)
- Breakpoints do Tailwind CSS
- Layout mobile-first

### Acessibilidade
- Navegação por teclado completa
- Labels e descrições adequadas
- Estados de focus visíveis
- Roles ARIA apropriados

### UX/UI
- Loading states em todas as operações
- Feedback visual para ações do usuário
- Tratamento consistente de erros
- Design system baseado em cores semânticas

## Funcionalidades Técnicas

### Performance
- Paginação client-side para reduzir requests
- Memoização de filtros com `useMemo`
- Lazy loading de detalhes do cliente
- Otimização de re-renders com `useCallback`

### Tratamento de Dados
- Parser CSV robusto com suporte a aspas
- Normalização de formatos de data brasileiros
- Formatação automática de valores monetários
- Sanitização de dados de entrada

### Estado Global
- Gerenciamento via hooks customizados
- Estado local para componentes específicos
- Sincronização entre lista e detalhes
- Cache inteligente de dados da API

## Configuração

### Google Sheets
O sistema está configurado para consumir dados de uma planilha específica com as seguintes abas:
- `clientes` - Dados principais dos clientes
- `contas` - Contas bancárias associadas
- `agencias` - Informações das agências
