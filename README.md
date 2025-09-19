# Sistema de Gestão de Clientes

Sistema web desenvolvido em React + TypeScript para gerenciamento de clientes bancários. Consome dados de planilhas Google Sheets e oferece interface responsiva para visualização, busca e detalhamento de informações.

## Funcionalidades

- **Lista Paginada**: Visualização organizada de todos os clientes cadastrados
- **Busca Inteligente**: Filtro por nome, email ou CPF/CNPJ em tempo real
- **Filtro por Agência**: Seleção específica de agência bancária
- **Perfil Completo**: Detalhamento de dados pessoais, financeiros e bancários
- **Gestão de Contas**: Visualização de contas correntes e poupanças
- **Informações de Agência**: Dados completos das agências bancárias
- **Interface Responsiva**: Otimizada para desktop, tablet e mobile
- **Acessibilidade**: Suporte completo ao VLibras para deficientes auditivos

## Tecnologias

- **React 18** - Framework JavaScript moderno
- **TypeScript** - Tipagem estática para maior segurança
- **Tailwind CSS** - Framework de estilos utilitários
- **Vite** - Build tool de alta performance
- **Google Sheets API** - Integração com planilhas como fonte de dados
- **VLibras** - Plugin de acessibilidade em Libras

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
│   └── api.ts                       # Serviço principal da API Google Sheets
├── types/
│   └── index.ts                     # Definições de tipos TypeScript
├── App.tsx                          # Componente raiz da aplicação
├── main.tsx                         # Ponto de entrada React
└── index.css                        # Configuração do Tailwind CSS
```

## Componentes Principais

### `ClientLista.tsx`
Componente orquestrador principal que gerencia:
- Carregamento assíncrono dos dados de clientes e agências
- Estado de loading e tratamento de erros
- Sistema de filtros por texto e agência
- Paginação dos resultados (10 clientes por página)
- Navegação entre lista e detalhes com preservação de estado

### `ClientCard.tsx`
Card interativo que apresenta:
- Informações essenciais do cliente (nome, nome social, email, CPF/CNPJ)
- Design responsivo com hover effects
- Navegação via clique ou teclado (Enter/Espaço)
- Estados visuais para melhor UX

### `ClientFiltro.tsx`
Sistema de filtros avançado com:
- Busca por nome, nome social ou CPF/CNPJ
- Dropdown de seleção de agências
- Botão de limpeza de filtros
- Sincronização de estado com componente pai

### `ClientesDetalhes.tsx`
Página completa de detalhamento com:
- Dados pessoais completos (CPF, RG, data de nascimento, estado civil)
- Informações de contato (email, endereço)
- Dados financeiros (renda anual, patrimônio)
- Lista dinâmica de contas bancárias
- Informações da agência associada
- Navegação de retorno com preservação de filtros

### `ContaCard.tsx`
Exibição formatada de contas com:
- Identificação visual por tipo (corrente/poupança)
- Saldo atual com cores baseadas no valor (positivo/negativo/zero)
- Limite de crédito e crédito disponível
- Cálculo do limite total disponível
- Formatação monetária brasileira (BRL)

### `AgenciaInfo.tsx`
Informações da agência com:
- Nome e código da agência
- Endereço completo
- Visual com gradiente temático

### `Paginacao.tsx`
Controles de navegação com:
- Botões numéricos inteligentes (máximo 5 visíveis)
- Navegação anterior/próximo
- Informações de itens exibidos
- Scroll automático ao topo
- Estados de loading

## Hooks Customizados

### `useClientes()`
Hook para gerenciamento de clientes:
- Carregamento assíncrono de todos os clientes
- Sistema de filtros com busca textual
- Paginação local eficiente
- Ordenação alfabética automática
- Tratamento robusto de erros

### `useContas()`
Hook para gerenciamento de contas:
- Busca de todas as contas do sistema
- Filtragem por CPF/CNPJ do cliente
- Estado de carregamento independente
- Cache inteligente de dados

### `useAgencias()`
Hook para gerenciamento de agências:
- Consulta de todas as agências
- Busca específica por código
- Ordenação alfabética
- Gerenciamento de estado assíncrono

## Integração com API

### `GoogleSheetsService`
Classe principal que abstrai a comunicação com Google Sheets:

#### Parser CSV Robusto
- Tratamento correto de aspas e vírgulas
- Suporte a campos com quebras de linha
- Normalização de headers automática
- Tratamento de caracteres especiais

#### Processamento de Dados
- Parser de datas brasileiras (dd/mm/yyyy)
- Normalização de valores monetários
- Mapeamento dinâmico de colunas
- Validação e sanitização de entrada

#### Métodos Disponíveis
- `buscarTodosClientes()` - Retorna todos os clientes
- `buscarTodasContas()` - Retorna todas as contas
- `buscarContasPorCliente(cpfCnpj)` - Contas de um cliente específico
- `buscarTodasAgencias()` - Retorna todas as agências
- `buscarAgenciaPorCodigo(codigo)` - Agência específica

## Estrutura de Dados

### Interface Cliente
```typescript
interface Cliente {
  id: string;                    // Identificador único
  nome: string;                  // Nome completo
  cpfCnpj: string;              // CPF ou CNPJ
  rg?: string;                   // RG (opcional)
  email: string;                 // Email de contato
  endereco: string;              // Endereço completo
  dataNascimento: Date;          // Data de nascimento
  nomeSocial?: string;           // Nome social (opcional)
  rendaAnual: number;            // Renda anual em reais
  patrimonio: number;            // Patrimônio total em reais
  estadoCivil: "Solteiro" | "Casado" | "Viúvo" | "Divorciado";
  codigoAgencia: number;         // Código da agência bancária
}
```

### Interface Conta
```typescript
interface Conta {
  id: string;                    // Identificador único
  cpfCnpjCliente: string;        // CPF/CNPJ do titular
  tipo: "corrente" | "poupanca"; // Tipo da conta
  saldo: number;                 // Saldo atual
  limiteCredito: number;         // Limite de crédito
  creditoDisponivel: number;     // Crédito ainda disponível
}
```

### Interface Agencia
```typescript
interface Agencia {
  id: string;                    // Identificador único
  codigo: number;                // Código numérico da agência
  nome: string;                  // Nome da agência
  endereco: string;              // Endereço da agência
}
```

## Padrões de Design

### Responsividade
- **Grid System**: 1-5 colunas adaptáveis baseado no breakpoint
- **Mobile-first**: Design otimizado para dispositivos móveis
- **Breakpoints**: Seguindo padrões do Tailwind CSS
  - `sm:` - 640px+
  - `md:` - 768px+
  - `lg:` - 1024px+
  - `xl:` - 1280px+

### Acessibilidade
- **Navegação por teclado**: Suporte completo a Tab, Enter, Espaço
- **ARIA Labels**: Descrições adequadas para leitores de tela
- **Roles semânticos**: Estrutura HTML5 correta
- **Contraste adequado**: Cores seguindo WCAG 2.1
- **VLibras**: Plugin oficial para tradução em Libras

### UX/UI
- **Loading States**: Spinners e mensagens em todas operações assíncronas
- **Error Handling**: Tratamento consistente com mensagens claras
- **Visual Feedback**: Hover effects e transições suaves
- **Design System**: Paleta de cores semânticas consistente
- **Micro-interactions**: Animações sutis para melhor engajamento

## Funcionalidades Técnicas

### Performance
- **Paginação Client-side**: Reduz requisições desnecessárias à API
- **Memoização Inteligente**: `useMemo` para filtros complexos
- **Lazy Loading**: Carregamento sob demanda de detalhes
- **Otimização de Re-renders**: `useCallback` em handlers críticos
- **Bundle Splitting**: Código dividido por funcionalidade

### Tratamento de Dados
- **Parser CSV Robusto**: Suporte a aspas, vírgulas e caracteres especiais
- **Normalização de Datas**: Múltiplos formatos brasileiros suportados
- **Formatação Monetária**: Intl.NumberFormat para valores em BRL
- **Sanitização de Entrada**: Limpeza automática de dados inconsistentes
- **Validação de Tipos**: TypeScript garantindo tipagem correta

### Gerenciamento de Estado
- **Hooks Customizados**: Encapsulamento de lógica complexa
- **Estado Local**: Componentes gerenciam seu próprio estado
- **Sincronização**: Estados compartilhados entre componentes relacionados
- **Preservação de Filtros**: Mantém estado ao navegar entre páginas
- **Error Boundaries**: Recuperação graceful de erros

#### 1. **clientes**
Dados principais dos clientes com colunas:
- id, nome, cpfCnpj, rg, email, endereco
- dataNascimento, nomeSocial, rendaAnual, patrimonio
- estadoCivil, codigoAgencia

#### 2. **contas**
Contas bancárias com colunas:
- id, cpfCnpjCliente, tipo, saldo
- limiteCredito, creditoDisponivel

#### 3. **agencias**
Informações das agências com colunas:
- id, codigo, nome, endereco

## 📱 Recursos de Acessibilidade

### VLibras
- **Plugin Oficial**: Integração com a ferramenta do governo brasileiro
- **Tradução Automática**: Todo conteúdo traduzido para Libras
- **Posicionamento Inteligente**: Widget não interfere na interface
- **Ativação Opcional**: Usuário controla quando usar

### Navegação Inclusiva
- **Foco Visível**: Indicadores claros de elemento focado
- **Ordem Lógica**: Tab order seguindo fluxo natural de leitura
- **Shortcuts**: Atalhos de teclado para ações principais
- **Descrições Contextuais**: ARIA labels descritivos

Este sistema representa uma solução completa para gerenciamento de clientes bancários, priorizando experiência do usuário, acessibilidade e manutenibilidade do código.