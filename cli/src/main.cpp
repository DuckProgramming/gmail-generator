#include <iostream>
#include <cstdlib>
#include <string>
#include <fstream>

void updateProxies(const std::string& newProxyFile, const std::string& proxyFile) {
    std::ifstream newFile(newProxyFile);
    std::ofstream oldFile(proxyFile);

    if (!newFile.is_open()) {
        std::cerr << "Erro ao abrir o arquivo " << newProxyFile << std::endl;
        return;
    }

    if (!oldFile.is_open()) {
        std::cerr << "Erro ao abrir o arquivo " << proxyFile << std::endl;
        return;
    }

    std::string line;
    while (getline(newFile, line)) {
        oldFile << line << std::endl;
    }

    newFile.close();
    oldFile.close();

    std::cout << "Lista de proxies atualizada com sucesso!\n";
}

int main() {
    std::string proxyFile = "proxies.txt";
    std::string tsScript = "bun install && bun --env-file .env ./src/app.ts";
    std::string encoding = "echo off && chcp 65001";

    system(encoding.c_str());

    std::cout << R"(
      ██╗    ██╗██╗  ██╗██╗   ██╗     ██████╗ ███████╗███╗   ██╗
      ██║    ██║██║  ██║╚██╗ ██╔╝    ██╔════╝ ██╔════╝████╗  ██║
      ██║ █╗ ██║███████║ ╚████╔╝     ██║  ███╗█████╗  ██╔██╗ ██║
      ██║███╗██║██╔══██║  ╚██╔╝      ██║   ██║██╔══╝  ██║╚██╗██║
      ╚███╔███╔╝██║  ██║   ██║       ╚██████╔╝███████╗██║ ╚████║
      ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝        ╚═════╝ ╚══════╝╚═╝  ╚═══╝
    )" << std::endl;

    char choice;
    std::cout << "Deseja atualizar a lista de proxies? (s/n): ";
    std::cin >> choice;

    if (choice == 's' || choice == 'S') {
        std::string newProxyFile;
        std::cout << "Digite o caminho do novo arquivo de proxies: ";
        std::cin >> newProxyFile;

        updateProxies(newProxyFile, proxyFile);
    } else {
        std::cout << "A lista de proxies não foi atualizada.\n";
    }
    
    std::cout << "Executando workflow...\n";
    int result = system(tsScript.c_str());
    
    if (result == 0) {
        std::cout << "Execução concluída com sucesso.\n";
    } else {
        std::cerr << "Falha na execução do Workflow.\n";
    }

    return result;
}
