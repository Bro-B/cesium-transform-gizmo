import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, "..")

const pkgJson = JSON.parse(
  readFileSync(resolve(rootDir, "package.json"), "utf-8")
)

const version = pkgJson.version || ""
const license = pkgJson.license || ""

const authorName =
  (pkgJson.author && pkgJson.author.name) || pkgJson.author || ""

const repositoryUrl =
  (pkgJson.repository && pkgJson.repository.url) || ""

const bannerLines = [
  "/**",
  " * @license",
  ` * ${pkgJson.name} - ${repositoryUrl}`,
  ` * Version ${version}`,
  " *",
  ` * Copyright ${authorName}`,
  " *",
  ` * Licensed under the ${license} License`,
  " *",
  " * Unless required by applicable law or agreed to in writing, software",
  ' * distributed under the License is distributed on an "AS IS" BASIS,',
  " * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.",
  " * See the License for the specific language governing permissions and",
  " * limitations under the License.",
  " */",
]

const banner = `${bannerLines.join("\n")}\n`

const targets = [
  resolve(rootDir, "dist/cesium-transform-gizmo.es.js"),
  resolve(rootDir, "dist/cesium-transform-gizmo.umd.js"),
]

for (const file of targets) {
  if (!existsSync(file)) continue
  const content = readFileSync(file, "utf-8")

  if (content.startsWith(banner)) {
    continue
  }

  const cleaned = content.replace(banner, "").trimStart()
  writeFileSync(file, `${banner}${cleaned}`, "utf-8")
}
