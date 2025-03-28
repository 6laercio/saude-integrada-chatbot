CREATE SCHEMA IF NOT EXISTS saude_integrada;

SET search_path TO saude_integrada, public;

-- Tabelas serão criadas pela aplicação usando Drizzle ORM
-- Este script garante apenas que o esquema exista

-- Comentário para facilitar a identificação do banco
COMMENT ON SCHEMA saude_integrada IS 'Esquema principal para o Chatbot da Clínica Saúde Integrada';
