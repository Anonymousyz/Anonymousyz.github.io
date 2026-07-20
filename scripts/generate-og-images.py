from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "og"
WIDTH = 1200
HEIGHT = 630

COLORS = {
    "paper": "#f5f2eb",
    "navy": "#0b1020",
    "cyan": "#2ce0c5",
    "orange": "#ff7f4f",
    "white": "#f8fafc",
    "muted": "#aab4c7",
}

FONT_CANDIDATES = {
    "regular": [
        Path("C:/Windows/Fonts/msyh.ttc"),
        Path("C:/Windows/Fonts/simhei.ttf"),
    ],
    "bold": [
        Path("C:/Windows/Fonts/msyhbd.ttc"),
        Path("C:/Windows/Fonts/simhei.ttf"),
    ],
}

CARDS = {
    "home.png": (["从分析到决策", "从技术到应用"], "Anonymousyz"),
    "projects.png": (["项目与实践"], "问题 · 职责 · 交付 · 证据"),
    "works.png": (["公开作品"], "代码 · 样例 · 测试 · 版本"),
    "about.png": (["关于"], "产业研究 · 项目方案 · 数字化系统"),
}


def font(size: int, weight: str = "regular") -> ImageFont.FreeTypeFont:
    for candidate in FONT_CANDIDATES[weight]:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    raise RuntimeError("未找到可用的中文字体；停止生成 OG 图，避免输出乱码。")


def make_card(filename: str, title_lines: list[str], subtitle: str) -> None:
    image = Image.new("RGB", (WIDTH, HEIGHT), COLORS["paper"])
    draw = ImageDraw.Draw(image)

    draw.rounded_rectangle((62, 54, 1138, 576), radius=18, fill=COLORS["navy"])
    draw.rectangle((62, 54, 74, 576), fill=COLORS["cyan"])
    draw.rectangle((110, 108, 168, 114), fill=COLORS["orange"])
    draw.text((110, 140), "DELIVERY EVIDENCE ARCHIVE", font=font(22), fill=COLORS["muted"])

    title_font = font(72, "bold")
    y = 222
    for line in title_lines:
        draw.text((110, y), line, font=title_font, fill=COLORS["white"])
        y += 98

    draw.line((110, 468, 1090, 468), fill="#25314b", width=2)
    draw.text((110, 500), subtitle, font=font(29), fill=COLORS["cyan"])
    draw.text((950, 505), "2026", font=font(22), fill=COLORS["muted"])

    OUTPUT.mkdir(parents=True, exist_ok=True)
    image.save(OUTPUT / filename, format="PNG", optimize=True)


def main() -> None:
    for filename, (title_lines, subtitle) in CARDS.items():
        make_card(filename, title_lines, subtitle)
    print(f"Generated {len(CARDS)} OG images in {OUTPUT}")


if __name__ == "__main__":
    main()
