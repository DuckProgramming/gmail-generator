cmake_minimum_required(VERSION 3.10)

project(WhyGen)

set(CMAKE_CXX_STANDARD 20)

if(MSVC)
    add_compile_options("/utf-8")
else()
    add_compile_options("-finput-charset=UTF-8" "-fexec-charset=UTF-8")
endif()

add_executable(WhyGen src/main.cpp)
