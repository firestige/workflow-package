# Fresh Reader Question Semantic Schema

| Field | Required | Meaning |
| --- | --- | --- |
| `question_set_id` | yes | identity of the complete test set |
| `design_binding` | yes | exact candidate Design content digest |
| `question_id` | yes | stable question identity |
| `source_identities` | yes | Brief/template identities that make the question relevant |
| `question` | yes | one downstream-reader discovery/use question |
| `expected_elements` | yes | evidence elements the Design should support, not a hidden answer script |
| `prohibited_context` | yes | author/grilling/review context the reader must not receive |

The question set must cover problem, decomposition, collaboration, ownership, constraints, quality mechanisms, parameter lifecycle, and acceptance. At least one question requires a correct explanation without stable IDs followed by successful ID lookup. It tests comprehension, not architecture preference.
