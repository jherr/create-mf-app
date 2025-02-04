import { describe, it, expect, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { buildProject } from "../index";

describe("Project Generation", () => {
  const testDir = "test-project";

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  describe("Application Projects", () => {
    const frameworks = [
      "react-18",
      "react-19",
      "vue3",
      "svelte",
      "preact",
      "lit-html",
      "solid-js",
      "vanilla",
    ];

    frameworks.forEach((framework) => {
      it(`should generate ${framework} application correctly`, async () => {
        await buildProject({
          name: testDir,
          framework,
          type: "Application",
          css: "CSS",
          withZephyr: 'no',
        });

        expect(fs.existsSync(testDir)).toBe(true);
        expect(fs.existsSync(path.join(testDir, "package.json"))).toBe(true);
        expect(fs.existsSync(path.join(testDir, "src"))).toBe(true);
      });
    });
  });

  describe("Library Projects", () => {
    it("should generate TypeScript library correctly", async () => {
      await buildProject({
        name: testDir,
        framework: "typescript",
        type: "Library",
        css: "CSS",
        withZephyr: "no",
      });

      expect(fs.existsSync(testDir)).toBe(true);
      expect(fs.existsSync(path.join(testDir, "package.json"))).toBe(true);
      expect(fs.existsSync(path.join(testDir, "src"))).toBe(true);
    });
  });

  describe("API Projects", () => {
    const frameworks = [
      "express",
      "nestjs-auth",
      "nestjs-todo",
      "graphql-apollo",
      "graphql-nexus",
      "graphql-subscriptions",
    ];

    frameworks.forEach((framework) => {
      it(`should generate ${framework} API correctly`, async () => {
        await buildProject({
          name: testDir,
          framework,
          type: "API",
          css: "CSS",
          withZephyr: 'no',
        });

        expect(fs.existsSync(testDir)).toBe(true);
        expect(fs.existsSync(path.join(testDir, "package.json"))).toBe(true);
        // expect(fs.existsSync(path.join(testDir, 'src'))).toBe(true);
      });
    });
  });

  describe("Tailwind Integration", () => {
    it("should have correct Tailwind setup", async () => {
      await buildProject({
        name: testDir,
        framework: "react-18",
        type: "Application",
        css: "Tailwind",
        withZephyr: 'no',
      });

      const indexCssPath = path.join(testDir, "src/index.css");
      const packageJsonPath = path.join(testDir, "package.json");

      // Verify index.css exists and has correct content
      expect(fs.existsSync(indexCssPath)).toBe(true);
      const indexCssContent = fs.readFileSync(indexCssPath, "utf-8");
      expect(indexCssContent.trim()).toBe('@import "tailwindcss";');

      // Verify package.json has correct Tailwind dependencies
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      expect(packageJson.devDependencies["@tailwindcss/postcss"]).toBe(
        "^4.0.3"
      );
      expect(packageJson.devDependencies["tailwindcss"]).toBe("^4.0.3");
    });
  });
});
