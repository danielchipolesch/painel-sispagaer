package br.mil.fab.sispagaer.painel.service;

import br.mil.fab.sispagaer.painel.dto.response.HeatmapBoletimDTO;
import br.mil.fab.sispagaer.painel.exception.NegocioException;
import br.mil.fab.sispagaer.painel.repository.BoletimFinanceiroRepository;
import io.quarkus.cache.CacheResult;
import io.smallrye.faulttolerance.api.CircuitBreakerName;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.faulttolerance.CircuitBreaker;
import org.eclipse.microprofile.faulttolerance.Retry;
import org.eclipse.microprofile.faulttolerance.Timeout;
import org.jboss.logging.Logger;

import java.time.temporal.ChronoUnit;

/**
 * Serviço de negócio para publicações de boletim financeiro.
 *
 * <p>Dispara as duas queries de heatmap (yearA e yearB) em paralelo usando
 * {@code Uni.combine().all()}, reduzindo a latência à metade em relação
 * a chamadas sequenciais.</p>
 *
 * <p>Cacheado por 1 hora — dados de publicação são imutáveis após o encerramento
 * do dia, portanto o TTL longo é seguro.</p>
 */
@ApplicationScoped
public class BoletimFinanceiroService {

    private static final Logger LOG = Logger.getLogger(BoletimFinanceiroService.class);

    @Inject
    BoletimFinanceiroRepository repository;

    /**
     * Retorna o heatmap comparativo de dois anos de publicações de boletim financeiro.
     *
     * <p>Ambos os anos são consultados em paralelo — o Mutiny combina os dois
     * {@code Uni} e só emite quando ambos completam, sem bloquear threads.</p>
     *
     * @param yearA Ano base (ex: 2024)
     * @param yearB Ano comparativo (ex: 2025)
     */
    @CacheResult(cacheName = "boletim-heatmap")
    @Timeout(value = 20, unit = ChronoUnit.SECONDS)
    @Retry(maxRetries = 2, delay = 500, delayUnit = ChronoUnit.MILLIS)
    @CircuitBreaker(requestVolumeThreshold = 8, failureRatio = 0.5, delay = 30, delayUnit = ChronoUnit.SECONDS)
    @CircuitBreakerName("boletim-heatmap-dw")
    public Uni<HeatmapBoletimDTO> buscarHeatmap(int yearA, int yearB) {
        validarAnos(yearA, yearB);

        LOG.infof("Buscando heatmap de boletim: %d vs %d", yearA, yearB);

        return Uni.combine().all()
            .unis(
                repository.buscarHeatmapPorAno(yearA),
                repository.buscarHeatmapPorAno(yearB)
            )
            .asTuple()
            .map(tuple -> new HeatmapBoletimDTO(
                yearA,
                yearB,
                tuple.getItem1(),
                tuple.getItem2()
            ));
    }

    private void validarAnos(int yearA, int yearB) {
        if (yearA < 2000 || yearA > 2100) {
            throw new NegocioException("yearA inválido: " + yearA, Response.Status.BAD_REQUEST);
        }
        if (yearB < 2000 || yearB > 2100) {
            throw new NegocioException("yearB inválido: " + yearB, Response.Status.BAD_REQUEST);
        }
    }
}
