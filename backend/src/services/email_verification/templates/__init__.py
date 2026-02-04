from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, Any


@dataclass
class EmailTemplateLoader:
    templates_dir: Path = field(default_factory=lambda: Path(__file__).parent)

    def load_and_render(
        self, template_name: str, context: Dict[str, Any]
    ) -> Dict[str, str]:

        result = {}

        html_path = self.templates_dir / f"{template_name}.html"
        if html_path.exists():
            html_content = html_path.read_text(encoding="utf-8")
            for key, value in context.items():
                html_content = html_content.replace(f"{{{key}}}", str(value))
            result["html"] = html_content
        else:
            result["html"] = ""

        txt_path = self.templates_dir / f"{template_name}.txt"
        if txt_path.exists():
            text_content = txt_path.read_text(encoding="utf-8")
            for key, value in context.items():
                text_content = text_content.replace(f"{{{key}}}", str(value))
            result["text"] = text_content
        else:
            result["text"] = ""

        return result


template_loader = EmailTemplateLoader()
