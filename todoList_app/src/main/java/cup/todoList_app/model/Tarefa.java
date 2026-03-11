package cup.todoList_app.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tarefas")
@Getter
@Setter
public class Tarefa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(min = 3, message = "O título deve ter pelo menos 3 caracteres.")
    @NotBlank(message = "O título da tarefa é obrigatório")
    @Column(nullable = false, length = 100)
    private String titulo;
    private String descricao;
    private String status = "PENDENTE";

    @Column(length = 20)
    private String prioridade = "BAIXA";

    @Column(name = "data_vencimento")
    @JsonFormat(pattern = "dd/MM/yyy HH:mm:ss")
    private LocalDateTime dataVencimento;

    @Column(name = "criado_em")
    @JsonFormat(pattern = "dd/MM/yyy HH:mm:ss")
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    @JsonFormat(pattern = "dd/MM/yyy HH:mm:ss")
    private LocalDateTime atualizadoEm;

    @PrePersist
    public void definirDataVencimentiPadrao() {
        if (this.dataVencimento == null) {
            this.dataVencimento = LocalDateTime.now().plusDays(7);
        }
    }

    @JoinColumn(name = "usuario_id", nullable = false)
    @ManyToOne
    private Usuario usuario;

    @JoinColumn(name = "categoria_id")
    @ManyToOne
    private Categoria categoria;
}
