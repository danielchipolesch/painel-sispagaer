package br.mil.fab.sispagaer.painel.repository;

import br.mil.fab.sispagaer.painel.dto.response.HeatmapItemDTO;
import io.smallrye.mutiny.Uni;
import io.vertx.mutiny.mysqlclient.MySQLPool;
import io.vertx.mutiny.sqlclient.Tuple;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.stream.StreamSupport;

/**
 * Repositório para a tabela {@code fat_publicacao_boletim}.
 *
 * <p>Retorna dados diários de publicações de boletim financeiro agrupados por data,
 * prontos para alimentar o heatmap de calendário no frontend.</p>
 */
@ApplicationScoped
public class BoletimFinanceiroRepository {

    private static final Logger LOG = Logger.getLogger(BoletimFinanceiroRepository.class);

    @Inject
    MySQLPool client;

    /**
     * Retorna todos os dias com publicações de boletim para um ano específico.
     *
     * <p>Agrega {@code qtd_publicacoes} por data caso haja múltiplos registros no mesmo dia.
     * Dias sem registro são omitidos — o frontend trata ausência como zero.</p>
     *
     * @param ano Ano civil a consultar (ex: 2024)
     */
    public Uni<List<HeatmapItemDTO>> buscarHeatmapPorAno(int ano) {
        var sql = """
            SELECT
                DATE_FORMAT(dat_publicacao, '%Y-%m-%d') AS data_fmt,
                SUM(qtd_publicacoes)                    AS total_publicacoes
            FROM fat_publicacao_boletim
            WHERE YEAR(dat_publicacao) = ?
              AND tp_boletim = 'FINANCEIRO'
            GROUP BY dat_publicacao
            ORDER BY dat_publicacao
            """;

        LOG.debugf("buscarHeatmapPorAno: ano=%d", ano);

        return client
            .preparedQuery(sql)
            .execute(Tuple.of(ano))
            .onItem().transform(rows ->
                StreamSupport.stream(rows.spliterator(), false)
                    .map(row -> new HeatmapItemDTO(
                        row.getString("data_fmt"),
                        ((Number) row.getValue("total_publicacoes")).intValue()
                    ))
                    .toList()
            )
            .onFailure().invoke(ex -> LOG.errorf(ex, "Erro em buscarHeatmapPorAno: ano=%d", ano));
    }
}
