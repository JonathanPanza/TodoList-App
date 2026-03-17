CREATE TABLE usuarios
(
    id        SERIAL PRIMARY KEY,
    nome      VARCHAR(100)        NOT NULL,
    email     VARCHAR(150) UNIQUE NOT NULL,
    senha     VARCHAR(255)        NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias
(
    id         SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios (id) ON DELETE CASCADE,
    nome       VARCHAR(50) NOT NULL,
    criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tarefas
(
    id              SERIAL PRIMARY KEY,
    usuario_id      INT REFERENCES usuarios (id) ON DELETE CASCADE,
    categoria_id    INT          REFERENCES categorias (id) ON DELETE SET NULL,
    titulo          VARCHAR(100) NOT NULL,
    descricao       TEXT,
    status          VARCHAR(20) DEFAULT 'PENDENTE',
    prioridade      VARCHAR(20) DEFAULT 'MEDIA',
    data_vencimento TIMESTAMP,
    criado_em       TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);