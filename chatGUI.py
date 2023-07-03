import PySimpleGUI as sg
import sys
from termcolor import colored, cprint
import colorama
from colorama import Fore
from chatBot import get_response

def main():
    # Define the layout
    layout = [
        [sg.Multiline(size=(100, 40), key='-OUTPUT-', autoscroll=True, reroute_stdout=True, reroute_cprint=True, write_only=True)],
        [sg.Input(size=(100, 1), key='-INPUT-')],
        [sg.Button('Send', bind_return_key=True), sg.Button('Clear'), sg.Button('Exit')]
    ]

    window = sg.Window('CarBot', layout, return_keyboard_events=True)

    while True:
        event, values = window.read()

        if event == sg.WINDOW_CLOSED or event == 'Exit':
            break

        if event == 'Send' and values['-INPUT-'].strip():
            user_input = values['-INPUT-'].strip()
            window['-INPUT-'].update('')
            user = colored("User: ", "red")
            print(user + user_input)
            print()

            chatbot_response = get_response(user_input)
            bot = colored("CarBot: ", "blue")
            print(bot + chatbot_response.text)
            print()

        if event == 'Clear':
            window['-OUTPUT-'].update('')

    window.close()

if __name__ == '__main__':
    main()
