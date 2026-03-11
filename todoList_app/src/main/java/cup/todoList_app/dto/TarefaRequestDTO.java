package cup.todoList_app.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record TarefaRequestDTO(
        @NotBlank(message = "O título da tarefa é obrigatório!")
        @Size(min = 3, message = "O título deve ter pelo menos 3 caracteres.")
        String titulo,
        String prioridade,
        String descricao,

        @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
        LocalDateTime dataVencimento,
        Long categoriaId
) {
}