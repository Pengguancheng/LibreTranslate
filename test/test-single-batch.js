const targets = ["id", "th", "vi", "zh-Hans"];
const lengths = [200, 300, 500];
const fullText = [
    "Hi Everyone, A few years ago, if you told me a handful of tools could replace 70% of what an entire dev team does, I’d have laughed. But here we are in 2025 — and AI has become a quiet but powerful co-founder for indie hackers, solo devs, and tech creators like you and me. This isn’t some vague futuristic dream. I’ve personally used these tools while building side projects, automating client work, and even brainstorming product ideas. And guess what? These tools are so good, they often feel like a cheat code.",
    "React is a JavaScript library full of fancy terms like reconciliation, composition, and error boundaries. What do all these terms actually mean? Let’s start from the beginning with components.",
    "Components are the building blocks of every React app. They allow us to make all the visible parts of our applications, like buttons, inputs, or even entire pages. Just like Legos, you can use components as many times as you want. Every React component is a JavaScript function that returns markup."
];

// 一次送多句（陣列形式）
async function batchTest(targetLang) {
    const input = fullText; // 模擬兩句

    const start = performance.now();
    const res = await fetch("http://10.20.146.25:5000/translate", {
        method: "POST",
        body: JSON.stringify({
            q: input,
            source: "en",
            target: targetLang,
            format: "text",
            alternatives: 1,
            api_key: ""
        }),
        headers: { "Content-Type": "application/json" }
    });
    await res.json();
    const end = performance.now();
    console.log(`[BATCH] [en→${targetLang}] ${Math.round(end - start)} ms`);
}

// 一句一句送（兩次並行）
async function singleTest(targetLang) {
    const start = performance.now();

    const translateOne = async (input) => {
        const res = await fetch("http://10.20.146.25:5000/translate", {
            method: "POST",
            body: JSON.stringify({
                q: input,
                source: "en",
                target: targetLang,
                format: "text",
                alternatives: 1,
                api_key: ""
            }),
            headers: { "Content-Type": "application/json" }
        });
        return await res.json();
    };

    for (const x of fullText) {
        await translateOne(x)
    }

    // await Promise.all(fullText.map(x => translateOne(x)));
    const end = performance.now();
    console.log(`[SINGLE] [en→${targetLang}] ${Math.round(end - start)} ms`);
}

// 主流程
(async () => {

    for (const target of targets) {
            const allTests = [];
            // 加入 batch 和 single 兩組測試
            allTests.push(batchTest(target));
            allTests.push(singleTest(target));
            await Promise.all(allTests);
    }

    console.log("✅ 所有測試完成");
})();
