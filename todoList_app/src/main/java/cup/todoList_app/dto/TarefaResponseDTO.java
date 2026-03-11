package cup.todoList_app.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import cup.todoList_app.model.Tarefa;

import java.time.LocalDateTime;

public record TarefaResponseDTO(
        Long id,
        String titulo,
        String descricao,
        String status,
        String prioridade,
        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime dataVencimento,
        CategoriaResponseDTO categoria
) {
    public TarefaResponseDTO(Tarefa tarefa) {
        this(
                tarefa.getId(),
                tarefa.getTitulo(),
                tarefa.getDescricao(),
                tarefa.getStatus(),
                tarefa.getPrioridade(),
                tarefa.getDataVencimento(),
                tarefa.getCategoria() != null ? new CategoriaResponseDTO(tarefa.getCategoria()) : null
        );
    }
}