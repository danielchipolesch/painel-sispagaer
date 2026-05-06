-- =============================================================================
-- PAINEL SISPAGAER — Data Warehouse (MySQL 8.4)
-- Schema estrela + seed de dados realistas para ambiente de desenvolvimento
-- =============================================================================

SET NAMES utf8mb4;
SET time_zone = '-03:00';

-- -----------------------------------------------------------------------------
-- Dimensão: Tempo
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dim_tempo (
    id_tempo   INT          NOT NULL AUTO_INCREMENT,
    ano        SMALLINT     NOT NULL,
    mes        TINYINT      NOT NULL,
    PRIMARY KEY (id_tempo),
    UNIQUE KEY uk_ano_mes (ano, mes)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Dimensão: Posto / Graduação
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dim_posto_graduacao (
    id_posto_graduacao  INT          NOT NULL AUTO_INCREMENT,
    sig_posto_graduacao VARCHAR(10)  NOT NULL,
    nom_posto_graduacao VARCHAR(100) NOT NULL,
    categoria           ENUM('OFICIAL','PRACA','CIVIL') NOT NULL,
    ord_hierarquia      TINYINT      NOT NULL,
    PRIMARY KEY (id_posto_graduacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Dimensão: Organização Militar
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dim_organizacao_militar (
    id_om        INT          NOT NULL AUTO_INCREMENT,
    cod_uasg     VARCHAR(10)  NOT NULL,
    sig_om       VARCHAR(30)  NOT NULL,
    nom_om       VARCHAR(200) NOT NULL,
    nom_comaer   VARCHAR(50),
    uf           CHAR(2)      NOT NULL,
    PRIMARY KEY (id_om),
    UNIQUE KEY uk_cod_uasg (cod_uasg)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Fato: Folha de Pagamento
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fat_folha_pagamento (
    id_fat             BIGINT         NOT NULL AUTO_INCREMENT,
    id_tempo           INT            NOT NULL,
    id_posto_graduacao INT            NOT NULL,
    id_om              INT            NOT NULL,
    cod_militar        VARCHAR(20)    NOT NULL,
    val_bruto          DECIMAL(14,2)  NOT NULL,
    val_liquido        DECIMAL(14,2)  NOT NULL,
    val_desconto       DECIMAL(14,2)  NOT NULL,
    PRIMARY KEY (id_fat),
    INDEX idx_tempo_posto (id_tempo, id_posto_graduacao),
    INDEX idx_tempo_om    (id_tempo, id_om),
    CONSTRAINT fk_fp_tempo FOREIGN KEY (id_tempo)           REFERENCES dim_tempo(id_tempo),
    CONSTRAINT fk_fp_posto FOREIGN KEY (id_posto_graduacao) REFERENCES dim_posto_graduacao(id_posto_graduacao),
    CONSTRAINT fk_fp_om    FOREIGN KEY (id_om)              REFERENCES dim_organizacao_militar(id_om)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Fato: Publicações de Boletim Financeiro (heatmap)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fat_publicacao_boletim (
    id_publicacao   BIGINT       NOT NULL AUTO_INCREMENT,
    dat_publicacao  DATE         NOT NULL,
    qtd_publicacoes SMALLINT     NOT NULL DEFAULT 1,
    tp_boletim      VARCHAR(20)  NOT NULL DEFAULT 'FINANCEIRO',
    PRIMARY KEY (id_publicacao),
    INDEX idx_dat_publicacao (dat_publicacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- CARGA DAS DIMENSÕES
-- =============================================================================

-- dim_tempo: Jan/2023 a Dez/2025 (36 meses de histórico)
INSERT INTO dim_tempo (ano, mes) VALUES
(2023,1),(2023,2),(2023,3),(2023,4),(2023,5),(2023,6),
(2023,7),(2023,8),(2023,9),(2023,10),(2023,11),(2023,12),
(2024,1),(2024,2),(2024,3),(2024,4),(2024,5),(2024,6),
(2024,7),(2024,8),(2024,9),(2024,10),(2024,11),(2024,12),
(2025,1),(2025,2),(2025,3),(2025,4),(2025,5),(2025,6),
(2025,7),(2025,8),(2025,9),(2025,10),(2025,11),(2025,12);

-- dim_posto_graduacao: Hierarquia completa da FAB
INSERT INTO dim_posto_graduacao (sig_posto_graduacao, nom_posto_graduacao, categoria, ord_hierarquia) VALUES
('CEL',  'Coronel',                     'OFICIAL', 1),
('TC',   'Tenente-Coronel',             'OFICIAL', 2),
('MAJ',  'Major',                       'OFICIAL', 3),
('CAP',  'Capitão',                     'OFICIAL', 4),
('1TEN', '1º Tenente',                  'OFICIAL', 5),
('2TEN', '2º Tenente',                  'OFICIAL', 6),
('ST',   'Subtenente',                  'PRACA',   7),
('1SGT', '1º Sargento',                 'PRACA',   8),
('2SGT', '2º Sargento',                 'PRACA',   9),
('3SGT', '3º Sargento',                 'PRACA',   10),
('CB',   'Cabo',                        'PRACA',   11),
('SD',   'Soldado',                     'PRACA',   12),
('CTEN', 'Contratado Temporário',       'CIVIL',   13),
('SERV', 'Servidor Civil',              'CIVIL',   14);

-- dim_organizacao_militar: Principais OMs da FAB
INSERT INTO dim_organizacao_militar (cod_uasg, sig_om, nom_om, nom_comaer, uf) VALUES
('120001', 'EMAER',    'Estado-Maior da Aeronáutica',                         'EMAER',  'DF'),
('120002', 'GABAER',   'Gabinete do Comandante da Aeronáutica',               'EMAER',  'DF'),
('120003', 'SEFA',     'Secretaria de Economia, Finanças e Administração',    'SEFA',   'DF'),
('120004', 'COMGEP',   'Comando-Geral de Pessoal',                            'COMGEP', 'DF'),
('120005', 'COMGAP',   'Comando-Geral do Apoio',                              'COMGAP', 'DF'),
('120006', 'COMGAR',   'Comando-Geral do Ar',                                 'COMGAR', 'RJ'),
('120007', 'DIRAD',    'Diretoria de Administração da Aeronáutica',           'COMGEP', 'DF'),
('120008', 'DIRSA',    'Diretoria de Saúde da Aeronáutica',                   'COMGEP', 'DF'),
('120009', 'DIRENG',   'Diretoria de Engenharia da Aeronáutica',              'COMGAP', 'DF'),
('120010', 'DECEA',    'Departamento de Controle do Espaço Aéreo',            'COMGAP', 'DF'),
('120011', 'DCTA',     'Departamento de Ciência e Tecnologia Aeroespacial',   'COMGAP', 'SP'),
('120012', 'DIMAER',   'Diretoria do Material Aeronáutico e Bélico',          'COMGAP', 'DF'),
('120013', 'INCAER',   'Instituto Histórico-Cultural da Aeronáutica',         'COMGEP', 'DF'),
('120014', 'CENIPA',   'Centro de Investigação e Prevenção de Acidentes',     'COMGAR', 'DF'),
('120015', 'AFA',      'Academia da Força Aérea',                             'COMGAR', 'SP'),
('120016', 'EEAR',     'Escola de Especialistas de Aeronáutica',              'COMGAR', 'SP'),
('120017', 'CAER',     'Clube de Aeronáutica',                                'COMGEP', 'RJ'),
('120018', 'COMAE',    'Comando Aéreo Leste',                                 'COMAE',  'RJ'),
('120019', 'CENCIAR',  'Centro de Medicina Aeroespacial',                     'DIRSA',  'SP'),
('120020', 'ASPAER',   'Associação dos Suboficiais e Sargentos da Aeronáutica','COMGEP','DF');

-- =============================================================================
-- GERAÇÃO DOS FATOS (stored procedures para performance)
-- =============================================================================

DROP PROCEDURE IF EXISTS gera_fat_folha;
DELIMITER //

CREATE PROCEDURE gera_fat_folha()
BEGIN
    DECLARE v_id_tempo      INT;
    DECLARE v_id_posto      INT;
    DECLARE v_id_om         INT;
    DECLARE v_ord_hier      INT;
    DECLARE v_base_sal      DECIMAL(14,2);
    DECLARE v_n_mil         INT;
    DECLARE v_i             INT;
    DECLARE v_cod           VARCHAR(20);
    DECLARE v_bruto         DECIMAL(14,2);
    DECLARE v_desconto      DECIMAL(14,2);
    DECLARE v_liquido       DECIMAL(14,2);
    DECLARE v_fator_mes     DECIMAL(5,4);

    -- Número de militares e salário base por posto
    -- (valores aproximados da tabela de remuneração FAB 2024/2025)
    DECLARE v_max_tempo     INT DEFAULT 36;
    DECLARE v_max_posto     INT DEFAULT 14;
    DECLARE v_max_om        INT DEFAULT 20;

    -- Loop de tempo
    SET v_id_tempo = 1;
    WHILE v_id_tempo <= v_max_tempo DO

        -- Loop de posto/graduação
        SET v_id_posto = 1;
        WHILE v_id_posto <= v_max_posto DO

            -- Parâmetros de distribuição por posto
            SELECT ord_hierarquia INTO v_ord_hier
            FROM dim_posto_graduacao WHERE id_posto_graduacao = v_id_posto;

            -- Salário base e efetivo típico por posto
            CASE v_ord_hier
                WHEN 1  THEN SET v_base_sal = 32000.00; SET v_n_mil = 3;
                WHEN 2  THEN SET v_base_sal = 26000.00; SET v_n_mil = 6;
                WHEN 3  THEN SET v_base_sal = 21000.00; SET v_n_mil = 10;
                WHEN 4  THEN SET v_base_sal = 16500.00; SET v_n_mil = 16;
                WHEN 5  THEN SET v_base_sal = 12500.00; SET v_n_mil = 14;
                WHEN 6  THEN SET v_base_sal = 10000.00; SET v_n_mil = 9;
                WHEN 7  THEN SET v_base_sal =  9200.00; SET v_n_mil = 11;
                WHEN 8  THEN SET v_base_sal =  7800.00; SET v_n_mil = 18;
                WHEN 9  THEN SET v_base_sal =  6800.00; SET v_n_mil = 20;
                WHEN 10 THEN SET v_base_sal =  5800.00; SET v_n_mil = 16;
                WHEN 11 THEN SET v_base_sal =  4600.00; SET v_n_mil = 12;
                WHEN 12 THEN SET v_base_sal =  3700.00; SET v_n_mil = 8;
                WHEN 13 THEN SET v_base_sal =  5000.00; SET v_n_mil = 4;
                ELSE         SET v_base_sal =  7500.00; SET v_n_mil = 3;
            END CASE;

            -- Fator de variação mensal leve (+/- 1%) por indice de tempo
            SET v_fator_mes = 1.0 + (v_id_tempo * 0.0008);

            -- Loop de OMs
            SET v_id_om = 1;
            WHILE v_id_om <= v_max_om DO

                -- Gera v_n_mil militares por (tempo, posto, om)
                SET v_i = 1;
                WHILE v_i <= v_n_mil DO
                    SET v_cod = CONCAT('MAT', LPAD(v_id_posto, 2, '0'), LPAD(v_id_om, 2, '0'), LPAD(v_i, 3, '0'));
                    -- Variação individual de ±15% + fator de tempo
                    SET v_bruto    = ROUND(v_base_sal * v_fator_mes * (0.88 + (v_id_om * v_i * 0.0007 MOD 0.24)), 2);
                    SET v_desconto = ROUND(v_bruto * (0.195 + ((v_id_om + v_i) * 0.001 MOD 0.04)), 2);
                    SET v_liquido  = v_bruto - v_desconto;

                    INSERT INTO fat_folha_pagamento
                        (id_tempo, id_posto_graduacao, id_om, cod_militar, val_bruto, val_liquido, val_desconto)
                    VALUES
                        (v_id_tempo, v_id_posto, v_id_om, v_cod, v_bruto, v_liquido, v_desconto);

                    SET v_i = v_i + 1;
                END WHILE;

                SET v_id_om = v_id_om + 1;
            END WHILE;

            SET v_id_posto = v_id_posto + 1;
        END WHILE;

        SET v_id_tempo = v_id_tempo + 1;
    END WHILE;
END //

DELIMITER ;

CALL gera_fat_folha();
DROP PROCEDURE gera_fat_folha;


-- =============================================================================
-- PUBLICAÇÕES DE BOLETIM FINANCEIRO (heatmap 2024-2025)
-- Gera dados diários para dias úteis com padrões realistas:
--   - Mais publicações no fechamento mensal (dias 23-31)
--   - Menos publicações em janeiro (início de ano)
--   - Zero aos fins de semana
-- =============================================================================

DROP PROCEDURE IF EXISTS gera_boletim;
DELIMITER //

CREATE PROCEDURE gera_boletim()
BEGIN
    DECLARE v_data      DATE    DEFAULT '2024-01-01';
    DECLARE v_fim       DATE    DEFAULT '2025-12-31';
    DECLARE v_dow       TINYINT;   -- 1=Dom..7=Sab
    DECLARE v_dom       TINYINT;   -- dia do mês
    DECLARE v_mes       TINYINT;
    DECLARE v_qtd       SMALLINT;
    DECLARE v_seed      INT;

    WHILE v_data <= v_fim DO
        SET v_dow = DAYOFWEEK(v_data);   -- 1=Dom, 7=Sab

        IF v_dow NOT IN (1, 7) THEN      -- somente dias úteis
            SET v_dom  = DAY(v_data);
            SET v_mes  = MONTH(v_data);
            -- seed determinístico para reprodutibilidade
            SET v_seed = TO_DAYS(v_data);

            -- Base: 1-4 publicações
            SET v_qtd = 1 + (v_seed * 7919 MOD 4);

            -- Pico de fechamento mensal: +2 a +6 nos dias 23-31
            IF v_dom >= 23 THEN
                SET v_qtd = v_qtd + 2 + ((v_seed * 1301) MOD 5);
            END IF;

            -- Janeiro: redução de verão/planejamento (30% menos)
            IF v_mes = 1 THEN
                SET v_qtd = GREATEST(1, FLOOR(v_qtd * 0.7));
            END IF;

            -- Julho: férias escolares — leve redução
            IF v_mes = 7 THEN
                SET v_qtd = GREATEST(1, FLOOR(v_qtd * 0.85));
            END IF;

            -- Dezembro: encerramento fiscal — pico +3
            IF v_mes = 12 AND v_dom >= 1 AND v_dom <= 20 THEN
                SET v_qtd = v_qtd + 2 + ((v_seed * 997) MOD 3);
            END IF;

            INSERT INTO fat_publicacao_boletim (dat_publicacao, qtd_publicacoes, tp_boletim)
            VALUES (v_data, v_qtd, 'FINANCEIRO');
        END IF;

        SET v_data = DATE_ADD(v_data, INTERVAL 1 DAY);
    END WHILE;
END //

DELIMITER ;

CALL gera_boletim();
DROP PROCEDURE gera_boletim;
