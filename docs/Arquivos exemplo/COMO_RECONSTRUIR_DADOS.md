# Como reconstruir o "Perfil completo.json"

O arquivo original `Perfil completo.json` é muito grande (cerca de 472 MB). Para viabilizar seu armazenamento aqui, ele foi compactado em um ZIP e dividido em 3 partes de até 20 MB cada:
- `Perfil completo.zip.part1`
- `Perfil completo.zip.part2`
- `Perfil completo.zip.part3`

## Instruções para remontar o arquivo:

### No Windows (via Prompt de Comando / cmd):
```cmd
copy /b "Perfil completo.zip.part1" + "Perfil completo.zip.part2" + "Perfil completo.zip.part3" "Perfil completo.zip"
```
*(Ajuste o comando incluindo mais partes caso existam)*

Após remontar o `Perfil completo.zip`, basta extraí-lo com qualquer ferramenta (WinRAR, 7-Zip, ou o próprio Windows) para ter acesso ao arquivo original `Perfil completo.json`.

### No Linux / Mac (via Terminal):
```bash
cat "Perfil completo.zip.part*"> "Perfil completo.zip"
unzip "Perfil completo.zip"
```
