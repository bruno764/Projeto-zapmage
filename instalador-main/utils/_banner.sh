#!/bin/bash
#
# Print banner art.

#######################################
# Print a board. 
# Globals:
#   BG_BROWN
#   NC
#   WHITE
#   CYAN_LIGHT
#   RED
#   GREEN
#   YELLOW
# Arguments:
#   None
#######################################
print_banner() {
  clear


printf "${GREEN}";
printf "######   ######   ######   ##  ##   #####    ######   ######   ##  ##   ######   ######\n";
printf "##  ##     ##     ##       ### ##   ##  ##   ##       ##  ##   ##  ##   ##  ##     ##\n";
printf "##  ##     ##     ####     ######   ##  ##   ####     ##       ######   ##  ##     ##\n";
printf "######     ##     ##       ## ###   ##  ##   ##       ##       ##  ##   ######     ##\n";
printf "##  ##     ##     ##       ##  ##   ##  ##   ##       ##  ##   ##  ##   ##  ##     ##\n";
printf "##  ##     ##     ######   ##  ##   #####    ######   ######   ##  ##   ##  ##     ##\n";

printf "\n"

printf "Solicite suporte: https://atendechat.com/suporte\n"
printf "Contrate nossos servidores: https://atendechat.com/servidores\n"
printf "2025 @ Todos os direitos reservados a https://atendechat.com\n"



  printf "${NC}";

  printf "\n"
}
