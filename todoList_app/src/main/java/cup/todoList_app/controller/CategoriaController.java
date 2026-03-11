package cup.todoList_app.controller;

import cup.todoList_app.dto.CategoriaRequestDTO;
import cup.todoList_app.dto.CategoriaResponseDTO;
import cup.todoList_app.model.Categoria;
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
@RequestMapping("/categorias")
@Tag(name = "Categoria", description = "Gerenciamento das Categorias do usuário.")
public class CategoriaController {

    @Autowired
    private CategoriaRepository repository;

    @Autowired
    private TarefaRepository tarefaRepository;

    @PostMapping
    @Operation(summary = "Criar nova categoria", description = "Cria uma categoria vinculada ao usuário logado.")
    public ResponseEntity<Object> criarCategoria(@Valid @RequestBody CategoriaRequestDTO dto) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (repository.existsByNomeIgnoreCaseAndUsuarioId(dto.nome(), usuarioLogado.getId())) {

            return ResponseEntity.badRequest().body("Já possui uma categoria com o nome '" + dto.nome() + "'.");
        }

        Categoria novaCategoria = new Categoria();
        novaCategoria.setNome(dto.nome());
        novaCategoria.setUsuario(usuarioLogado);

        Categoria salva = repository.save(novaCategoria);
        return ResponseEntity.ok(new CategoriaResponseDTO(salva));
    }

    @GetMapping
    @Operation(summary = "Listar minhas categorias", description = "Traz todas as categorias do usuário logado.")
    public ResponseEntity<List<CategoriaResponseDTO>> listarMinhasCategorias() {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<CategoriaResponseDTO> lista = repository.findByUsuarioId(usuarioLogado.getId())
                .stream()
                .map(CategoriaResponseDTO::new)
                .toList();

        return ResponseEntity.ok(lista);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar categoria", description = "Apaga uma categoria se ela pertencer ao usuário logado.")
    public ResponseEntity<Void> deletarCategoria(@PathVariable Long id) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return repository.findByIdAndUsuarioId(id, usuarioLogado.getId())
                .map(categoria -> {

                    List<Tarefa> tarefasVinculadas = tarefaRepository.findByCategoriaId(categoria.getId());

                    for (Tarefa tarefa : tarefasVinculadas) {
                        tarefa.setCategoria(null);
                        tarefaRepository.save(tarefa);
                    }

                    repository.delete(categoria);

                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
