package cup.todoList_app.controller;

import cup.todoList_app.dto.TarefaRequestDTO;
import cup.todoList_app.dto.TarefaResponseDTO;
import cup.todoList_app.dto.TarefaUpdateDTO;
import cup.todoList_app.model.Tarefa;
import cup.todoList_app.model.Usuario;
import cup.todoList_app.repository.CategoriaRepository;
import cup.todoList_app.repository.TarefaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tarefas")
@Tag(name = "Tarefas", description = "Gerenciamento das tarefas do usuário")
public class TarefaController {
    @Autowired
    private TarefaRepository repository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @GetMapping
    @Operation(summary = "Listar minhas tarefas", description = "Traz todas as tarefas vinculadas ao usuário logado.")
    public ResponseEntity<List<TarefaResponseDTO>> listarMinhasTarefas() {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<Tarefa> minhasTarefas = repository.findByUsuarioId(usuarioLogado.getId());

        List<TarefaResponseDTO> tarefasLimpas = minhasTarefas.stream()
                .map(TarefaResponseDTO::new)
                .toList();

        return ResponseEntity.ok(tarefasLimpas);
    }

    @PostMapping
    @Operation(summary = "Criar tarefas", description = "Cria as tarefas do usuário logado.")
    public ResponseEntity<Object> criarTarefa(@Valid @RequestBody TarefaRequestDTO tarefaRequest) {

        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Tarefa novaTarefa = new Tarefa();
        novaTarefa.setTitulo(tarefaRequest.titulo());
        novaTarefa.setDescricao(tarefaRequest.descricao());
        novaTarefa.setPrioridade(tarefaRequest.prioridade());
        novaTarefa.setDataVencimento(tarefaRequest.dataVencimento());
        novaTarefa.setUsuario(usuarioLogado);

        if (tarefaRequest.categoriaId() != null) {

            var categoriaEncontrada = categoriaRepository.findByIdAndUsuarioId(tarefaRequest.categoriaId(), usuarioLogado.getId());

            if (categoriaEncontrada.isEmpty()) {
                return ResponseEntity.badRequest().body("Categoria não encontrada ou não pertence a você.");
            }

            novaTarefa.setCategoria(categoriaEncontrada.get());
        }
        Tarefa tarefa = repository.save(novaTarefa);
        return ResponseEntity.ok(new TarefaResponseDTO(tarefa));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza as tarefas", description = "Atualiza a tarefa do usuario.")
    public ResponseEntity<Object> atualizarTarefa(@PathVariable Long id, @Valid @RequestBody TarefaUpdateDTO dto) {

        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var tarefaOptional = repository.findByIdAndUsuarioId(id, usuarioLogado.getId());
        if (tarefaOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Tarefa tarefa = tarefaOptional.get();

        tarefa.setTitulo(dto.titulo());
        tarefa.setDescricao(dto.descricao());
        tarefa.setStatus(dto.status());
        tarefa.setPrioridade(dto.prioridade());
        tarefa.setDataVencimento(dto.dataVencimento());

        if (dto.categoriaId() != null) {
            var categoriaEncontrada = categoriaRepository.findByIdAndUsuarioId(dto.categoriaId(), usuarioLogado.getId());

            if (categoriaEncontrada.isEmpty()) {
                return ResponseEntity.badRequest().body("Categoria não encontrada ou não pertence a você.");
            }
            tarefa.setCategoria(categoriaEncontrada.get());
        } else {
            tarefa.setCategoria(null);
        }

        Tarefa atualizada = repository.save(tarefa);
        return ResponseEntity.ok(new TarefaResponseDTO(atualizada));

    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Apaga a tarefas", description = "Apaga a tarefa do usuário.")
    public ResponseEntity<Void> deletarTarefa(@PathVariable Long id) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return repository.findByIdAndUsuarioId(id, usuarioLogado.getId())
                .map(tarefa -> {
                    repository.delete(tarefa);
                    return ResponseEntity.noContent().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Busca a tarefas por status", description = "Busca todas as tarefaspor status vinculadas ao usuário logado.")
    public ResponseEntity<List<Tarefa>> buscarPorStatus(@PathVariable String status) {
        List<Tarefa> listaDeTarefas = repository.findByStatus(status.toUpperCase());
        if (listaDeTarefas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(listaDeTarefas);
    }
}
