import ast
import hashlib


class FraudService:
    @staticmethod
    def generate_ast_signature(code: str) -> str:
        """
        Generates a structural signature of the code by stripping names,
        making it resistant to simple variable renames.
        """
        try:
            tree = ast.parse(code)

            for node in ast.walk(tree):
                if isinstance(node, ast.Name):
                    node.id = "var"
                elif isinstance(node, ast.FunctionDef):
                    node.name = "func"
                elif isinstance(node, ast.arg):
                    node.arg = "arg"

            dump = ast.dump(tree)
            return hashlib.sha256(dump.encode()).hexdigest()
        except Exception:
            # Fallback to simple hash if AST parsing fails
            return hashlib.sha256(code.encode()).hexdigest()

    @staticmethod
    def check_plagiarism(code: str, known_signatures: list[str]) -> tuple[float, str]:
        """
        Checks the provided code against a list of known signatures.
        Returns match score (0-100) and analysis.
        """
        signature = FraudService.generate_ast_signature(code)

        if signature in known_signatures:
            return 100.0, "Exact structural match detected. High probability of plagiarism."

        return 0.0, "No obvious structural matches found in the current dataset."
